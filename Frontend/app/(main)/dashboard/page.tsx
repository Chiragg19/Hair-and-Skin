"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import Link from 'next/link';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const pendingCount = bookings.filter(b => b.status !== 'Completed').length;

  const updateStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, "bookings", id), { status: newStatus });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;500;600&display=swap');
        
        body { margin: 0; padding: 0; background: radial-gradient(circle at top left, #141416 0%, #09090a 100%); color: #ededed; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; min-height: 100vh; }
        .app-container { display: flex; min-height: 100vh; max-width: 1800px; margin: 0 auto; }
        
        .left-panel { width: 35%; padding: 80px 60px; display: flex; flex-direction: column; justify-content: space-between; position: sticky; top: 0; height: 100vh; box-sizing: border-box; border-right: 1px solid rgba(255,255,255,0.03); z-index: 10;}
        .right-panel { width: 65%; padding: 80px 60px 120px 60px; }
        
        .brand-title { font-family: 'Playfair Display', serif; font-size: 5vw; line-height: 0.95; margin: 0 0 24px 0; color: #ffffff; font-weight: 400; letter-spacing: -1px; }
        .brand-title i { color: #d4b78f; font-weight: 400; }

        .stat-card { background: rgba(255,255,255,0.01); padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.04); backdrop-filter: blur(10px); margin-bottom: 20px; }
        
        .booking-item { background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 32px; margin-bottom: 20px; transition: all 0.4s ease; backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; }
        .booking-item:hover { border-color: rgba(212, 183, 143, 0.3); background: rgba(212, 183, 143, 0.02); }

        .btn-outline { background: transparent; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.1); padding: 14px 24px; border-radius: 100px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.3s; letter-spacing: 1px; text-transform: uppercase; }
        .btn-outline:hover { border-color: #fff; color: #fff; }

        .confirm-btn { background: #d4b78f; color: #000; padding: 12px 24px; border: none; border-radius: 100px; font-weight: 600; font-size: 12px; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; }
        .confirm-btn:hover { background: #fff; transform: translateY(-2px); }
        .confirm-btn.done { background: rgba(255,255,255,0.05); color: #71717a; cursor: default; }

        @media (max-width: 1024px) {
          .app-container { flex-direction: column; }
          .left-panel { width: 100%; height: auto; position: relative; padding: 50px 30px; border-right: none; }
          .right-panel { width: 100%; padding: 50px 30px; }
        }
      `}} />

      <div className="app-container">
        {}
        <div className="left-panel">
          <div>
            <div style={{ color: '#d4b78f', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '5px', marginBottom: '24px', fontWeight: '600' }}>Admin Portal</div>
            <h1 className="brand-title">Studio <i>&</i><br/>Insight.</h1>
            
            <div style={{ marginTop: '50px' }}>
              <div className="stat-card">
                <p style={{ color: '#71717a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Total Revenue</p>
                <p style={{ fontSize: '36px', color: '#d4b78f', fontFamily: '"Playfair Display", serif' }}>₹{totalRevenue.toLocaleString()}</p>
              </div>
              
              <div className="stat-card">
                <p style={{ color: '#71717a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Pending Sessions</p>
                <p style={{ fontSize: '36px', color: '#fff', fontFamily: '"Playfair Display", serif' }}>{pendingCount}</p>
              </div>
            </div>
          </div>

          <div>
            <Link href="/" className="btn-outline" style={{ display: 'inline-block', textAlign: 'center', width: '100%', textDecoration: 'none', boxSizing: 'border-box' }}>
              Back to Salon App
            </Link>
          </div>
        </div>

        {}
        <div className="right-panel">
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', fontWeight: '400', marginBottom: '10px' }}>Current Queue</h2>
            <p style={{ color: '#71717a', fontWeight: '300' }}>Manage upcoming luxury appointments and client sessions.</p>
          </div>

          <div className="booking-list">
            {loading ? (
              <p style={{ color: '#d4b78f' }}>Loading Studio Data...</p>
            ) : bookings.length > 0 ? (
              bookings.map((b) => (
                <div key={b.id} className="booking-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#d4b78f', fontWeight: '600' }}>{b.date}</span>
                      <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '100px', color: '#a1a1aa', textTransform: 'uppercase' }}>{b.time}</span>
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff', fontWeight: '400' }}>{b.clientEmail?.split('@')[0]}</h3>
                    <p style={{ color: '#71717a', fontSize: '13px', margin: 0, fontWeight: '300' }}>{b.services}</p>
                  </div>

                  <div style={{ textAlign: 'right', marginLeft: '40px' }}>
                    <p style={{ fontSize: '24px', color: '#fff', fontFamily: '"Playfair Display", serif', marginBottom: '15px' }}>₹{b.total}</p>
                    <button 
                      onClick={() => updateStatus(b.id, 'Completed')}
                      className={`confirm-btn ${b.status === 'Completed' ? 'done' : ''}`}
                    >
                      {b.status === 'Completed' ? 'Archived' : 'Confirm'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#71717a', textAlign: 'center', padding: '100px 0', fontWeight: '300' }}>No reservations found in the queue.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}