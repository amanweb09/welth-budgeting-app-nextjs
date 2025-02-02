import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React, { Suspense } from 'react'
import { getDashboardData, getUserAccounts } from '../actions/dashboard'
import { Account } from "@/prisma/generated/client";
import AccountCard from '@/components/account-card'
import { getCurrentBudget } from '../actions/budget'
import BudgetProgress from '@/components/budget-progress'
import DashboardOverview from '@/components/dashboard-overview'

const Dashboard = async () => {

  const accounts = await getUserAccounts()

  const defaultAccount: Account = accounts?.find((a: Account) => a.isDefault)
  let budgetData: any = null;

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id)
  }

  const transactions = await getDashboardData()

  return (
    <div className='space-y-8'>
      {/* budget progress */}
      {
        defaultAccount
        &&
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0} />
      }

      {/* overview */}
      <Suspense fallback={"Loading overview..."}>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []} />
      </Suspense>

      {/* accounts grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer>
          <Card className='hover:shadow-md transition-shadow cursor-pointer border-dashed'>
            <CardContent className='flex flex-col items-center justify-center text-muted-foreground h-full pt-5'>
              <Plus className='h-10 w-10 mb-2' />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {
          accounts.length > 0
          &&
          accounts?.map((account: Account) => <AccountCard
            key={account.id}
            account={account} />)
        }
      </div>
    </div>
  )
}

export default Dashboard