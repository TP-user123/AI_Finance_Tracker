const cron = require("node-cron");
const User = require("../Model/User");
const Transaction = require("../Model/Transaction");
const dayjs = require("dayjs");

// Run once daily at 12:10 AM
cron.schedule("10 0 * * *", async () => {
  console.log("🔁 Running auto recurring transaction job...");

  try {
    const users = await User.find({ "spendingLimit.expectedRecurringList": { $exists: true, $ne: [] } });

    for (const user of users) {
      let hasChanges = false;

      for (let item of user.spendingLimit.expectedRecurringList) {
        const { source, amount, type, frequency, autoAdd } = item;

        if (!autoAdd || frequency === "none") continue;

        const lastDate = dayjs(item.date || new Date());
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
          // ✅ Create transaction
          await Transaction.create({
            userId: user._id,
            source,
            amount,
            type,
            category: source,
            description: `Auto recurring: ${source}`,
            date: new Date(),
          });

          // ✅ Update recurring item
          item.date = new Date(); // Set new base date
          item.status = "pending";
          item.completedOn = null;
          item.nextDueDate = calculateNextDueDate(new Date(), frequency);
          hasChanges = true;
        }
      }

      if (hasChanges) {
        user.markModified("spendingLimit.expectedRecurringList");
        await user.save();
      }
    }

    console.log("✅ Auto recurring task done.");
  } catch (err) {
    console.error("❌ Cron error:", err);
  }
});

function calculateNextDueDate(currentDate, frequency) {
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
  }
  return date;
}
