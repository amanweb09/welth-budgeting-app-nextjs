import { getUserAccounts } from '@/app/actions/dashboard'
import { defaultCategories } from '@/data/categories'
import React from 'react'
import AddTransactionForm from '../_components/add-transaction-form'

const CreateTransaction = async () => {

  const accounts = await getUserAccounts()

  return (
    <div className='max-w-3xl mx-auto px-8 pt-20'>
      <h1 className='text-5xl gradient-title mb-8'>Add Transaction</h1>

      <AddTransactionForm accounts={accounts} categories={defaultCategories}/>
    </div>
  )
}

export default CreateTransaction