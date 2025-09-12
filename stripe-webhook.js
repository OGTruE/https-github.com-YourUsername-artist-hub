const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { buffer } = require('micro')
const admin = require('firebase-admin')

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) })
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')
  const sig = req.headers['stripe-signature']
  const buf = await buffer(req)
  let event
  try{ event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET) } catch(err){ console.error(err); return res.status(400).send(`Webhook Error: ${err.message}`) }
  if (event.type === 'checkout.session.completed'){
    const session = event.data.object
    const bookingId = session.metadata.bookingId
    const db = admin.firestore()
    await db.collection('bookings').doc(bookingId).update({ status: 'paid', paidAt: admin.firestore.FieldValue.serverTimestamp(), paymentIntent: session.payment_intent })
  }
  res.status(200).json({ received: true })
}
