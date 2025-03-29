const Income=require("../models/Income")
const Expense=require("../models/Expense")
const {isValidObjectId,Types}=require("mongoose");

exports.getDashboardData=async(req,res)=>{
    try{
        const userId=req.user.id;
        const userObjectId=new Types.ObjectId(String(userId))

        const totalIncome=await Income.aggregate([
            { $match:{userId:userObjectId}},
            {$group:{_id:null,total:{$sum:"$amount"}}},
        ]);

        const totalExpense=await Expense.aggregate([
            { $match:{userId:userObjectId}},
            {$group:{_id:null,total:{$sum:"$amount"}}},
        ]);

        //get income transactions in lsat 60 days
        const last60DaysIncomeTransaction=await Income.find({
            userId,
            date:{$gte:new Date(Date.now()- 60*24*60*60*1000)}
        }).sort({date:-1})

        //get total income for last 60days
        const incomeLast60Days=last60DaysIncomeTransaction.reduce((sum,transaction)=> sum+transaction.amount,0);

        //get expense transaction in the last 30 days
        const last30DaysExpenseTransactions=await Expense.find({
            userId,
            date:{$gte:new Date(Date.now() - 30*24*60*60*1000)},
        }).sort({date:-1})

        //get total expense for last 30 days
        const expensesLast30Days=last30DaysExpenseTransactions.reduce((sum,transaction)=>sum+transaction.amount,0);

        //fetch last 5 transactions(income+expenses)
        const lastTransactions=[
            ...(await Income.find({userId}).sort({date:-1}).limit(5)).map((txn)=>({
                ...txn.toObject(),
                type:"income"
            })),
            ...(await Expense.find({userId}).sort({date:-1}).limit(5)).map((txn)=>({
                ...txn.toObject(),
                type:"expense"
            }))
        ].sort((a,b)=>b.date - a.date); //sort latest first
        //Final respoonse
        res.json({
            totalBalance:(totalIncome[0].total || 0) - (totalExpense[0]?.total || 0),
             totalIncome:totalIncome[0].total || 0,
             totalExpenses:totalExpense[0]?.total || 0,
             last30DaysExpenses:{
                total:expensesLast30Days,
                transactions:last30DaysExpenseTransactions,
             },
             last60DaysIncome:{
                total:incomeLast60Days,
                transactions:last60DaysIncomeTransaction
             },
             recentTransactions:lastTransactions,
        })
    } catch(error){
        console.log(error)
        res.status(500).json({message:"server Error",error})
    }
}