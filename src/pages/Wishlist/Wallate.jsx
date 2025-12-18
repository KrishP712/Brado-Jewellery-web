
import React from 'react'
import wallet from '../../assets/images/wishlist/wallet.png'

function Wallate() {
  return (
     <div className="space-y-6">
     
           <div className="text-center py-16">
             <div className="mb-6">
               <div className="mx-auto w-40 h-30 rounded-full flex items-center justify-center mb-4">
                 <img src={wallet} alt="" />
               </div>
               <h3 className="text-[18px] text-gray-900 mb-2">Your wallet is empty!</h3>
               <p className="text-gray-500 text-[15px]">Look like there are no transactions in your wallet at the moment.</p>
             </div>
           </div>
         </div>
  )
}

export default Wallate
