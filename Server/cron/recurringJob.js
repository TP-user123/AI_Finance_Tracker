const cron = require("node-cron");
const User = require("../Model/User");
const Transaction = require("../Model/Transaction"); // Your existing transaction model
const dayjs = require("dayjs"); // or use native Date if preferred

// Schedule to run every day at 00:10 AM
cron.schedule("10 0 * * *", async () => {
  console.log("🕒 Running recurring transactions cron job");

  try {
    const users = await User.find({ "spendingLimit.expectedRecurringList": { $exists: true, $ne: [] } });

    for (const user of users) {
      for (const item of user.spendingLimit.expectedRecurringList) {
        const { source, amount, type, date, frequency, autoAdd } = item;

        if (!autoAdd || frequency === "none") continue;

        const lastDate = dayjs(date);
        const today = dayjs();

        let shouldAdd = false;
        switch (frequency) {
          case "daily":
            shouldAdd = today.diff(lastDate, "day") >= 1;
            break;
          case "weekly":
            shouldAdd = today.diff(lastDate, "week") >= 1;
            break;
          case "monthly":
            shouldAdd = today.diff(lastDate, "month") >= 1;
            break;
          case "yearly":
            shouldAdd = today.diff(lastDate, "year") >= 1;
            break;
        }

        if (shouldAdd) {
          // Add transaction
          await Transaction.create({
            userId: user._id,
            source,
            amount,
            type,
            category: source,
            description: `Auto recurring: ${source}`,
            date: new Date(), // use today's date
          });

          // Update item's last processed date
          item.date = new Date(); // Reset recurrence start
        }
      }

      await user.save(); // Save updated recurring item dates
    }

    console.log("✅ Recurring transactions processed");
  } catch (err) {
    console.error("❌ Error in recurring cron job:", err);
  }
});

const updateNextDueDate = (currentDate, frequency) => {
  const date = new Date(currentDate);
  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      break;
  }
  return date.toISOString().split("T")[0];
};

cron.schedule("0 0 * * *", async () => {
  console.log("Running recurring job...");

  const users = await User.find();

  for (const user of users) {
    const list = user.spendingLimit.expectedRecurringList;
    for (let item of list) {
      const today = new Date().toISOString().split("T")[0];
      if (item.date === today) {
        // Create a real transaction
        await Transaction.create({
          user: user._id,
          source: item.source,
          amount: item.amount,
          type: item.type,
          date: new Date(),
          category: "Recurring",
        });

        // Update next due date
        item.date = updateNextDueDate(item.date, item.frequency);

        // Reset status
        item.status = "pending";
        item.completedOn = null;
      }
    }
    await user.save();
  }

  console.log("Recurring job completed.");
});
