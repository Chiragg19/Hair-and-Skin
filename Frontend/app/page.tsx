"use client";
import { useState, useEffect } from 'react';
// --- NEW: FIREBASE CLOUD IMPORTS ---
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

export default function App() {
  // --- NEW: AUTHENTICATION STATE ---
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState('');
  
  const [activeDemographic, setActiveDemographic] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMounted, setIsMounted] = useState(false);

  const [cart, setCart] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [next7Days, setNext7Days] = useState<Date[]>([]);

  // --- NEW: LISTEN FOR LIVE LOGIN CHANGES ---
  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setEmail(currentUser.email || '');
    });

    const today = new Date();
    const daysArray = Array.from({length: 7}, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
    setNext7Days(daysArray);

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // --- NEW: HANDLE SECURE LOGIN / SIGNUP ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setPassword(''); // Clear password on success
    } catch (error: any) {
      setAuthError(error.message.replace('Firebase: ', '')); // Clean up error message
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCart([]);
    setEmail('');
    setPassword('');
  };

  // --- EXACT RATE CARD DATA ---
  const salonMenu = [
    { demo: "Women", category: "Crimping + Curls", name: "Upto Shoulder", price: "₹800", time: "45 mins", desc: "Professional styling." },
    { demo: "Women", category: "Crimping + Curls", name: "Below Shoulder", price: "₹900", time: "60 mins", desc: "Professional styling." },
    { demo: "Women", category: "Crimping + Curls", name: "Upto Waist Length", price: "₹1000", time: "75 mins", desc: "Professional styling." },
    { demo: "Women", category: "Crimping + Curls", name: "Below Waist Length", price: "₹1100", time: "90 mins", desc: "Professional styling." },
    { demo: "Women", category: "Hair Color", name: "Majirel Root Touch-up (1 inch)", price: "₹900", time: "45 mins", desc: "Base root matching." },
    { demo: "Women", category: "Hair Color", name: "Majirel Global Color (Upto Shoulder)", price: "₹2500", time: "90 mins", desc: "Full coverage." },
    { demo: "Men", category: "Hair Color", name: "Majirel Global Color", price: "₹800", time: "60 mins", desc: "Full coverage." },
    { demo: "Women", category: "Inoa (Ammonia Free)", name: "Inoa Root Touch-up (1 inch)", price: "₹1100", time: "45 mins", desc: "Ammonia-free root touch-up." },
    { demo: "Women", category: "Inoa (Ammonia Free)", name: "Inoa Global Color (Upto Shoulder)", price: "₹3000", time: "90 mins", desc: "Ammonia-free full coverage." },
    { demo: "Men", category: "Inoa (Ammonia Free)", name: "Inoa Global Color", price: "₹900", time: "60 mins", desc: "Ammonia-free full coverage." },
    { demo: "Women", category: "Hair & Beard Services", name: "Advanced Haircut", price: "₹700", time: "45 mins", desc: "Precision styling." },
    { demo: "Men", category: "Hair & Beard Services", name: "Advanced Haircut", price: "₹200", time: "45 mins", desc: "Precision styling." },
    { demo: "Men", category: "Hair & Beard Services", name: "Beard Styling", price: "₹150", time: "20 mins", desc: "Sculpting and finishing." },
    { demo: "Women", category: "Hair Wash", name: "Normal Shampoo + Conditioner", price: "₹250", time: "20 mins", desc: "Cleanse and refresh." },
    { demo: "Men", category: "Hair Wash", name: "Normal Shampoo + Conditioner", price: "₹150", time: "15 mins", desc: "Cleanse and refresh." },
    { demo: "Women", category: "Blow Dry", name: "Wash + Blow Dry", price: "₹500", time: "45 mins", desc: "Voluminous finish." },
    { demo: "Women", category: "Head Massage", name: "Almond Oil", price: "₹450", time: "30 mins", desc: "Nourishing head massage." },
    { demo: "Men", category: "Head Massage", name: "Almond Oil", price: "₹350", time: "30 mins", desc: "Nourishing head massage." },
    { demo: "Women", category: "Advanced Hair Treatment", name: "Keratin / Cysteine (Upto Shoulder)", price: "₹3500", time: "120 mins", desc: "Smooth, frizz-free hair." },
    { demo: "Men", category: "Advanced Hair Treatment", name: "Keratin / Cysteine", price: "₹1500", time: "90 mins", desc: "Smooth, frizz-free hair." },
    { demo: "Unisex", category: "Facials", name: "Fruit Facial", price: "₹1000", time: "60 mins", desc: "Natural glow." },
    { demo: "Unisex", category: "Advance Facial", name: "O3 Whitening / O3 Diamond", price: "₹2700", time: "90 mins", desc: "Luxury bridal care." },
    { demo: "Women", category: "Rica Chocolate Wax", name: "Full Hands (with underarms)", price: "₹500", time: "30 mins", desc: "Premium wax." },
    { demo: "Men", category: "Rica Chocolate Wax", name: "Full Hands (with underarms)", price: "₹600", time: "30 mins", desc: "Premium wax." },
    { demo: "Women", category: "Manicure", name: "Herbal / Lotus", price: "₹400", time: "45 mins", desc: "Nail and hand care." },
    { demo: "Unisex", category: "Pedicure", name: "Foot Massage (20 mins)", price: "₹400", time: "20 mins", desc: "Relaxing foot therapy." },
  ];

  const reviews = [
    { name: "Priya S.", rating: "★★★★★", text: "Absolutely loved the Keratin treatment. The staff is highly professional and the ambiance is purely luxurious." },
    { name: "Rahul M.", rating: "★★★★★", text: "Best beard styling and haircut I've had in the city. The attention to detail is unmatched." },
    { name: "Ananya K.", rating: "★★★★★", text: "The O3 Diamond facial gave me an instant glow for my event. Clean, hygienic, and incredibly relaxing." }
  ];

  const demographics = ['All', 'Women', 'Men', 'Kids', 'Unisex'];
  const categories = ['All', ...Array.from(new Set(salonMenu.map(item => item.category)))];

  const filteredMenu = salonMenu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    let matchesDemo = false;
    if (activeDemographic === 'All') matchesDemo = true;
    else if (activeDemographic === 'Unisex') matchesDemo = item.demo === 'Unisex';
    else matchesDemo = item.demo === activeDemographic || item.demo === 'Unisex'; 
    return matchesCategory && matchesDemo;
  });

  const timeSlots = ["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM", "07:00 PM"];

  const toggleCartItem = (service: any) => {
    if (cart.includes(service)) setCart(cart.filter(item => item !== service));
    else setCart([...cart, service]);
  };

  const getEstimatedTotal = () => {
    return cart.reduce((total, item) => {
      const match = item.price.match(/\d+/);
      return total + (match ? parseInt(match[0]) : 0);
    }, 0);
  };

  // --- NEW: SAVE BOOKING TO FIREBASE CLOUD ---
  const handleConfirmBooking = async () => {
    if (selectedDate !== null && selectedTime && user) {
      try {
        await addDoc(collection(db, 'bookings'), {
          userId: user.uid,
          clientEmail: user.email,
          date: next7Days[selectedDate].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          time: selectedTime,
          services: cart.map(item => item.name).join(', '),
          total: getEstimatedTotal(),
          status: 'Upcoming',
          createdAt: new Date()
        });

        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setCart([]);
          setIsModalOpen(false);
          setSelectedDate(null);
          setSelectedTime(null);
        }, 3000); 
      } catch (error) {
        console.error("Error saving booking: ", error);
        alert("There was an issue saving your booking. Please try again.");
      }
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;500;600&display=swap');
        
        body { margin: 0; padding: 0; background: radial-gradient(circle at top left, #141416 0%, #09090a 100%); color: #ededed; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; min-height: 100vh; }
        .app-container { display: flex; min-height: 100vh; max-width: 1800px; margin: 0 auto; }
        
        .left-panel { width: 35%; padding: 80px 60px; display: flex; flex-direction: column; justify-content: space-between; position: sticky; top: 0; height: 100vh; box-sizing: border-box; border-right: 1px solid rgba(255,255,255,0.03); z-index: 10;}
        .right-panel { width: 65%; padding: 80px 60px 120px 60px; }
        
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; }
        
        .brand-title { font-family: 'Playfair Display', serif; font-size: 5vw; line-height: 0.95; margin: 0 0 24px 0; color: #ffffff; font-weight: 400; letter-spacing: -1px; }
        .brand-title i { color: #d4b78f; font-weight: 400; }
        
        .demo-tabs { display: flex; background: rgba(255,255,255,0.02); border-radius: 100px; padding: 6px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(10px); }
        .demo-tab { flex: 1; text-align: center; padding: 12px; color: #71717a; font-weight: 500; cursor: pointer; border-radius: 100px; transition: all 0.4s ease; font-size: 14px; letter-spacing: 0.5px; }
        .demo-tab.active { background: #d4b78f; color: #000; box-shadow: 0 4px 15px rgba(212, 183, 143, 0.15); }

        .category-scroll-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 20px; margin-bottom: 40px; scrollbar-width: none; white-space: nowrap; }
        .category-scroll-container::-webkit-scrollbar { display: none; }
        .filter-pill { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; padding: 10px 22px; border-radius: 100px; cursor: pointer; transition: all 0.3s ease; font-weight: 400; font-size: 13px; flex-shrink: 0; letter-spacing: 0.5px; }
        .filter-pill:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .filter-pill.active { background: #fff; border-color: #fff; color: #000; font-weight: 500; }
        
        .service-card { background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 32px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; backdrop-filter: blur(10px); }
        .service-card.selected { border-color: #d4b78f; background: rgba(212, 183, 143, 0.05); }
        
        .login-input { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); padding: 18px 20px; color: #fff; border-radius: 12px; margin-bottom: 16px; font-family: inherit; font-size: 14px; outline: none; box-sizing: border-box; transition: all 0.3s; }
        .login-input:focus { border-color: #d4b78f; background: rgba(255,255,255,0.02); }
        
        .btn-primary { width: 100%; background: #d4b78f; color: #000; padding: 18px; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1.5px; }
        .btn-primary:hover { background: #e6cba5; box-shadow: 0 10px 25px rgba(212, 183, 143, 0.2); }
        .btn-primary:disabled { background: #222; color: #555; cursor: not-allowed; box-shadow: none; }
        
        .btn-outline { background: transparent; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.1); padding: 14px 24px; border-radius: 100px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.3s; letter-spacing: 1px; text-transform: uppercase; }
        .btn-outline:hover { border-color: #fff; color: #fff; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.4s ease; padding: 20px; }
        .modal-content { background: #111112; border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; padding: 48px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
        .modal-content::-webkit-scrollbar { display: none; }
        
        .date-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 25px; scrollbar-width: none; }
        .date-box { min-width: 75px; padding: 16px 10px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); text-align: center; cursor: pointer; transition: all 0.3s; }
        .date-box.active { background: #fff; color: #000; border-color: #fff; }
        
        .time-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 35px; }
        .time-box { padding: 14px; text-align: center; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.3s; }
        .time-box.active { background: #fff; color: #000; border-color: #fff; }

        .floating-cart { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: rgba(212, 183, 143, 0.95); backdrop-filter: blur(10px); color: #000; padding: 16px 40px; border-radius: 100px; font-weight: 600; font-size: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); cursor: pointer; z-index: 50; display: flex; align-items: center; gap: 15px; transition: all 0.3s; border: 1px solid rgba(255,255,255,0.2); }
        .floating-cart:hover { transform: translateX(-50%) translateY(-5px); background: #e6cba5; }

        .section-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 400; margin-bottom: 30px; color: #fff; }
        .review-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 60px; padding-top: 60px; border-top: 1px solid rgba(255,255,255,0.05); }
        .review-card { background: rgba(255,255,255,0.02); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        
        .footer { margin-top: 80px; padding: 60px; background: rgba(0,0,0,0.3); border-radius: 30px; border: 1px solid rgba(255,255,255,0.03); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px; }
        .footer-col h4 { color: #d4b78f; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0; }
        .footer-col p { color: #a1a1aa; font-size: 15px; line-height: 1.8; margin: 0 0 10px 0; font-weight: 300; }

        @media (max-width: 1024px) {
          .app-container { flex-direction: column; }
          .left-panel { width: 100%; height: auto; position: relative; padding: 50px 30px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .right-panel { width: 100%; padding: 50px 30px; }
          .brand-title { font-size: 56px; }
          .footer { padding: 40px 30px; flex-direction: column; }
        }
      `}} />

      {cart.length > 0 && !isModalOpen && (
        <div className="floating-cart animate-up" onClick={() => setIsModalOpen(true)}>
          <span>{cart.length} Service{cart.length > 1 ? 's' : ''} Selected</span>
          <span style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }}></span>
          <span>Est. ₹{getEstimatedTotal()}+</span>
          <span style={{ marginLeft: '10px' }}>Book Now →</span>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal-content animate-up">
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '28px', background: 'none', border: 'none', color: '#71717a', fontSize: '28px', fontWeight: '300', cursor: 'pointer' }}>×</button>
            
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '70px', height: '70px', background: '#d4b78f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#000', fontSize: '32px', fontWeight: '300' }}>✓</div>
                <h2 style={{ margin: '0 0 12px 0', fontFamily: '"Playfair Display", serif', fontSize: '32px', fontWeight: '400' }}>Confirmed.</h2>
                <p style={{ color: '#a1a1aa', fontWeight: '300' }}>Your luxury experience is booked. Details sent to {user?.email}</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ color: '#d4b78f', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '500' }}>Your Reservation</span>
                  <h2 style={{ margin: '10px 0 20px 0', fontSize: '26px', fontWeight: '400', fontFamily: '"Playfair Display", serif' }}>Selected Services</h2>
                  
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {cart.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i !== cart.length -1 ? '15px' : '0', paddingBottom: i !== cart.length -1 ? '15px' : '0', borderBottom: i !== cart.length -1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div>
                          <div style={{ color: '#fff', fontSize: '15px', fontWeight: '400' }}>{item.name}</div>
                          <div style={{ color: '#71717a', fontSize: '12px', marginTop: '4px' }}>{item.category} • {item.time}</div>
                        </div>
                        <div style={{ color: '#d4b78f', fontSize: '15px', fontFamily: '"Playfair Display", serif' }}>{item.price}</div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#fff', fontWeight: '500' }}>Estimated Total</span>
                      <span style={{ color: '#fff', fontSize: '18px', fontFamily: '"Playfair Display", serif' }}>₹{getEstimatedTotal()}+</span>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#71717a', marginBottom: '16px', fontWeight: '500' }}>Select Date</h3>
                <div className="date-scroll">
                  {next7Days.map((date, i) => {
                    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tmrw' : date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = date.getDate();
                    return (
                      <div key={i} className={`date-box ${selectedDate === i ? 'active' : ''}`} onClick={() => setSelectedDate(i)}>
                        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>{dayName}</div>
                        <div style={{ fontSize: '22px', fontWeight: '400', fontFamily: '"Playfair Display", serif' }}>{dayNum}</div>
                      </div>
                    );
                  })}
                </div>

                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#71717a', marginBottom: '16px', marginTop: '28px', fontWeight: '500' }}>Select Time</h3>
                <div className="time-grid">
                  {timeSlots.map((time, i) => (
                    <div key={i} className={`time-box ${selectedTime === time ? 'active' : ''}`} onClick={() => setSelectedTime(time)}>
                      {time}
                    </div>
                  ))}
                </div>

                <button className="btn-primary" disabled={selectedDate === null || selectedTime === null} onClick={handleConfirmBooking}>
                  Confirm Appointment
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="app-container">
        <div className="left-panel">
          <div className="animate-up" style={{ opacity: 0 }}>
            <div style={{ color: '#d4b78f', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '5px', marginBottom: '24px', fontWeight: '600' }}>Premium Salon</div>
            <h1 className="brand-title">Hair <i>&</i><br/>Skin.</h1>
            <p style={{ color: '#a1a1aa', fontSize: '16px', lineHeight: '1.7', maxWidth: '320px', fontWeight: '300' }}>
              Redefining luxury grooming and skincare. Build your custom session and book today.
            </p>
          </div>

          <div className="animate-up delay-2" style={{ opacity: 0, marginTop: '50px' }}>
            {!user ? (
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
                <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '400', letterSpacing: '1px' }}>
                  {isLoginMode ? "Client Login" : "Create Account"}
                </h3>
                {authError && <div style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '15px' }}>{authError}</div>}
                
                <form onSubmit={handleAuth}>
                  <input type="email" placeholder="Email Address" className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <input type="password" placeholder="Password (Min 6 chars)" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  
                  <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                    {isLoginMode ? "Sign In" : "Sign Up"}
                  </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button onClick={() => setIsLoginMode(!isLoginMode)} style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                    {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Sign In"}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#d4b78f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '400', fontSize: '24px', fontFamily: '"Playfair Display", serif' }}>
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: '#71717a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Welcome back</div>
                    <div style={{ fontSize: '18px', fontWeight: '400', color: '#fff', wordBreak: 'break-all' }}>{user.email?.split('@')[0]}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-outline" style={{ width: '100%' }}>Secure Logout</button>
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="animate-up delay-1" style={{ opacity: 0 }}>
            <div className="demo-tabs">
              {demographics.map(demo => (
                <div key={demo} onClick={() => setActiveDemographic(demo)} className={`demo-tab ${activeDemographic === demo ? 'active' : ''}`}>{demo}</div>
              ))}
            </div>
            
            <div className="category-scroll-container">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredMenu.length > 0 ? filteredMenu.map((service, index) => {
              const isSelected = cart.includes(service);
              return (
                <div key={service.name + index} className={`service-card animate-up ${isSelected ? 'selected' : ''}`} style={{ animationDelay: `${0.03 * index}s`, opacity: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#d4b78f', fontWeight: '600' }}>{service.category}</span>
                        <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '100px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{service.demo}</span>
                      </div>
                      <h3 style={{ margin: '0', fontSize: '20px', color: '#fff', fontWeight: '400', letterSpacing: '0.2px' }}>{service.name}</h3>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '400', fontFamily: '"Playfair Display", serif', color: '#fff', textAlign: 'right', minWidth: '70px', paddingLeft: '10px' }}>{service.price}</div>
                  </div>
                  <p style={{ color: '#71717a', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.6', fontWeight: '300' }}>{service.desc}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <span style={{ color: '#71717a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '300' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {service.time}
                    </span>
                    <button 
                      onClick={() => { if(user) toggleCartItem(service); }}
                      style={{ background: isSelected ? '#d4b78f' : 'transparent', border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.2)', color: isSelected ? '#000' : (user ? '#fff' : '#555'), padding: '8px 16px', borderRadius: '100px', cursor: user ? 'pointer' : 'not-allowed', fontWeight: '500', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.3s' }}
                    >
                      {!user ? "Login to Book" : (isSelected ? "Added ✓" : "+ Add")}
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div style={{ color: '#71717a', gridColumn: '1 / -1', textAlign: 'center', padding: '60px', fontWeight: '300', fontSize: '15px' }}>No services match this exact filter combination. Try selecting 'All'.</div>
            )}
          </div>

          <div className="review-grid">
            <div style={{ gridColumn: '1 / -1' }}><h2 className="section-title">Client Experiences</h2></div>
            {reviews.map((review, i) => (
              <div key={i} className="review-card">
                <div style={{ color: '#d4b78f', fontSize: '16px', marginBottom: '12px' }}>{review.rating}</div>
                <p style={{ color: '#e4e4e7', fontSize: '15px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px', fontWeight: '300' }}>"{review.text}"</p>
                <div style={{ color: '#a1a1aa', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>— {review.name}</div>
              </div>
            ))}
          </div>

          <div className="footer">
            <div className="footer-col" style={{ flex: '1 1 250px' }}>
              <h1 className="brand-title" style={{ fontSize: '32px', marginBottom: '10px' }}>Hair <i>&</i> Skin.</h1>
              <p>The premier destination for luxury grooming, styling, and skin treatments.</p>
            </div>
            <div className="footer-col" style={{ flex: '1 1 200px' }}>
              <h4>Visit Us</h4><p>Shop no 4, N-Oslo CHS Ltd Puranik City, Ghodbunder Rd, opp. Vedant Hospital, Owale, Thane, Maharashtra 400615</p>
            </div>
            <div className="footer-col" style={{ flex: '1 1 200px' }}>
              <h4>Contact & Hours</h4><p>+91073041 81457<br/></p>
              <p style={{ marginTop: '10px', color: '#d4b78f' }}>Mon - Sun: 10:00 AM - 8:00 PM<br/></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}