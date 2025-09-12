const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')
  try{
    const { bookingId, amount } = req.body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price_data: { currency: 'usd', product_data: { name: `Booking deposit ${bookingId}` }, unit_amount: amount }, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=1&booking=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=1`,
      metadata: { bookingId }
    })
    res.json({ url: session.url })
  }catch(e){console.error(e); res.status(500).json({error:'Server error'})}
}
