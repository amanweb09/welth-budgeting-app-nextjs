import { getAccountWithTransactions } from '@/app/actions/account'
import TransactionTable from '@/app/transaction/_components/transaction-table'
// import AccountChart from '@/components/account-chart'
import { IRouteWithParam } from '@/types'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const Account = async ({ params }: IRouteWithParam) => {
  const accountId = (await params).id
  const accountData = await getAccountWithTransactions(accountId)

  if (!accountData) return notFound()

  const { transactions, ...account } = accountData

  return (
    <div className='pt-20 space-y-8'>
      <div className='flex gap-4 items-end justify-between'>
        <div>
          <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>
            {account.name}
          </h1>
          <p className='text-muted-foreground capitalize'>{account.type} Account</p>
        </div>

        <div className='text-right pb-2'>
          <div className='text-xl sm:text-2xl font-bold'>
            &#8377;{account.balance.toFixed(2)}
          </div>
          <p className='text-sm to-muted-foreground'>
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* chart */}
      {/* <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />}>
        <AccountChart transactions={transactions} />
      </Suspense> */}

      {/* transaction table */}
      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  )
}

export default Account