import React, { useState } from 'react';
import { StudentData, Level } from '../types';
import { Camera, User, BookOpen, MessageSquare, Heart, CreditCard, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FlyerFormProps {
  data: StudentData;
  onChange: (data: StudentData) => void;
  isPaid: boolean;
  setIsPaid: (val: boolean) => void;
}

export default function FlyerForm({ data, onChange, isPaid, setIsPaid }: FlyerFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Safety check for payment lock
    if (isPaid && (name === 'name' || name === 'photo')) {
      if (!confirm('Modifying your name or photo after payment might require a new payment. Continue?')) {
        return;
      }
      setIsPaid(false);
    }

    if (name === 'name') {
      let newValue = value.slice(0, 17);
      const parts = newValue.split(' ');
      if (parts.length > 2) {
        newValue = parts.slice(0, 2).join(' ');
      }
      onChange({ ...data, [name]: newValue });
      return;
    }

    if (name === 'favoriteWord') {
      onChange({ ...data, [name]: value.slice(0, 20) });
      return;
    }
    
    onChange({ ...data, [name]: value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isPaid) {
        if (!confirm('Changing photo will reset your payment status. Continue?')) return;
        setIsPaid(false);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = async () => {
    const publicKey = (import.meta as any).env.VITE_FLUTTERWAVE_PUBLIC_KEY;

    if (!publicKey || publicKey === "") {
      const msg = "Public Key required: Flutterwave Public Key is missing. Please set VITE_FLUTTERWAVE_PUBLIC_KEY in the environment variables (Settings > Environment Variables).";
      alert(msg);
      throw new Error(msg);
    }

    if (!data.name || !data.photo) {
      alert("Please enter your name and upload a photo first.");
      return;
    }

    setIsProcessing(true);
    const txRef = `flw_nacos_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || '';

    try {
      // 1. Submit pending record to database
      const response = await fetch(`${backendUrl}/api/students/pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          txRef
        })
      });

      if (!response.ok) {
        throw new Error("Failed to initialize transaction on server");
      }

      // 2. Open Flutterwave Checkout
      window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: txRef,
        amount: 500,
        currency: "NGN",
        payment_options: "card, university, mobilemoneyghana, ussd",
        customer: {
          email: "student@mapoly.edu.ng",
          name: data.name,
        },
        customizations: {
          title: "NACOS MAPOLY Finalist Flyer",
          description: "Payment for generation of premium finalist flyer",
          logo: "https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/NACOSMM.png",
        },
        callback: (payment: any) => {
          console.log("Payment callback:", payment);
          if (payment.status === "successful") {
            checkPaymentVerification(txRef);
          } else {
            setIsProcessing(false);
            alert("Payment failed. Please try again.");
          }
        },
        onclose: () => {
          setIsProcessing(false);
          console.log("Check-out closed");
        },
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const checkPaymentVerification = async (txRef: string) => {
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || '';
    try {
      const response = await fetch(`${backendUrl}/api/verify-payment/${txRef}`);
      const result = await response.json();
      if (result.verified) {
        setIsPaid(true);
        alert("Payment verified! You can now download your flyer.");
      } else {
        // Retry a few times if webhook is slow?
        setTimeout(() => checkPaymentVerification(txRef), 3000);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!isPaid) {
      alert("Please make a payment of ₦500 to download.");
      return;
    }

    const flyerElement = document.getElementById('flyer-capture');
    if (!flyerElement) return;

    try {
      const canvas = await html2canvas(flyerElement, {
        useCORS: true,
        scale: 4, // High quality
        backgroundColor: '#0d2e1a',
      });
      
      const link = document.createElement('a');
      link.download = `NACOS_Finalist_${data.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Generation failed. Please ensure you uploaded a clear photo.');
    }
  };

  return (
    <div className="bg-[#112417] border-r border-[#1E3A28] flex flex-col h-full overflow-hidden">
      <div className="p-6 pb-4">
        <h2 className="text-xs font-bold tracking-[0.2em] text-[#4ADE80] uppercase mb-1 flex items-center gap-2">
          Flyer Studio
        </h2>
        <h1 className="text-xl font-serif italic text-white">Face of the Finalist</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6 scrollbar-thin scrollbar-thumb-[#1E3A28]">
        {/* Photo Upload Section */}
        <section className="space-y-3">
          <label className="editorial-label">Student Portrait</label>
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange}
              className="hidden" 
              id="photo-upload"
            />
            <label 
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center w-full h-40 border border-[#1E3A28] bg-[#0A1A0F] hover:bg-[#0d2113] hover:border-[#4ADE80] transition-all cursor-pointer overflow-hidden"
            >
              {data.photo ? (
                <div className="relative w-full h-full p-2">
                  <img src={data.photo} className="w-full h-full object-cover rounded shadow-inner" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[#4ADE80] text-[10px] font-bold px-3 py-1 bg-[#0A1A0F]/80 uppercase tracking-widest border border-[#4ADE80]">Replace Photo</span>
                  </div>
                </div>
              ) : (
                <>
                  <Camera size={24} className="text-[#4ADE80] mb-2 opacity-50" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Click to upload portrait</span>
                </>
              )}
            </label>
          </div>
        </section>

        {/* Full Name Section */}
        <section className="space-y-3">
          <FormField 
            label="Full Name" 
            name="name" 
            value={data.name} 
            onChange={handleChange} 
            placeholder="Max 17 chars, 1 space" 
            maxLength={17}
          />
        </section>

        {/* Personal & Social */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#1E3A28] pb-1">Personal & Social Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="State of Origin" name="stateOfOrigin" value={data.stateOfOrigin} onChange={handleChange} placeholder="e.g. Ogun State" />
            <FormField label="Birthday" name="birthday" value={data.birthday} onChange={handleChange} placeholder="Month Day" />
            <FormField label="Relationship Status" name="relationshipStatus" value={data.relationshipStatus} onChange={handleChange} placeholder="Single/Married" />
            <FormField label="Nickname" name="nickname" value={data.nickname} onChange={handleChange} placeholder="e.g. Tech Guru" />
            <FormField label="Hobby" name="hobby" value={data.hobby} onChange={handleChange} placeholder="Reading, Coding..." />
            <FormField label="Social Handle" name="socialHandle" value={data.socialHandle} onChange={handleChange} placeholder="@username" />
          </div>
          <FormField label="Favorite Word / Quote" name="favoriteWord" value={data.favoriteWord} onChange={handleChange} placeholder="Max 20 chars" maxLength={20} />
          <FormField label="Class Crush" name="classCrush" value={data.classCrush} onChange={handleChange} placeholder="Who is your crush?" />
        </section>

        {/* Academic Profile */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#1E3A28] pb-1">Academic Profile</h3>
          
          <div className="flex flex-col gap-1 mb-4">
            <label className="editorial-label">Current Level / Class</label>
            <div className="relative">
              <select 
                name="level" 
                value={data.level} 
                onChange={handleChange}
                className="editorial-input appearance-none bg-[#0a1a0f] pr-10"
              >
                <option value="ND2">ND2</option>
                <option value="HND2_SWD">HND2 - SWD "Class of Paragons 2026"</option>
                <option value="HND2_NCC">HND2 - NCC "Class of Cloud Pioneers 2026"</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <BookOpen size={14} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Best Level" name="bestLevel" value={data.bestLevel} onChange={handleChange} placeholder="e.g. ND 1" />
            <FormField label="Difficult Level" name="difficultLevel" value={data.difficultLevel} onChange={handleChange} placeholder="e.g. HND 2" />
            <FormField label="Best Course" name="bestCourse" value={data.bestCourse} onChange={handleChange} placeholder="Favorite subject" />
            <FormField label="Worse Course" name="worstCourse" value={data.worstCourse} onChange={handleChange} placeholder="Toughest subject" />
            <FormField label="Favorite Lecturer" name="favoriteLecturer" value={data.favoriteLecturer} onChange={handleChange} placeholder="Name yours" />
            <FormField label="Post Held" name="postHeld" value={data.postHeld} onChange={handleChange} placeholder="e.g. President" />
          </div>
          <FormField label="If Not Com. Sci., What Else?" name="careerAlternative" value={data.careerAlternative} onChange={handleChange} placeholder="e.g. Law, Arts..." />
        </section>

        {/* Future & Professional */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#1E3A28] pb-1">Future & Professional</h3>
          <div className="grid grid-cols-1 gap-3">
            <FormField label="Business Skill" name="businessSkill" value={data.businessSkill} onChange={handleChange} placeholder="e.g. Tailoring, Crypto..." />
            <FormField label="What Next After School?" name="whatNext" value={data.whatNext} onChange={handleChange} placeholder="Your future plans..." />
            <FormField label="Best Experience On Campus" name="bestCampusExperience" value={data.bestCampusExperience} onChange={handleChange} placeholder="Memorable moment..." />
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-[#1E3A28] bg-[#0A1A0F] space-y-3">
        {!isPaid ? (
          <button 
            onClick={handlePayment}
            disabled={isProcessing || !data.name || !data.photo}
            className="w-full bg-[#4ADE80] text-black font-black py-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CreditCard size={16} />
            )}
            Pay ₦500 to Generate
          </button>
        ) : (
          <button 
            onClick={handleDownload}
            className="w-full bg-[#4ADE80] text-black font-black py-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#22c55e] transition-colors"
          >
            <Download size={16} />
            Download HD Flyer
          </button>
        )}
        <p className="text-[8px] text-center text-gray-500 font-bold uppercase tracking-tighter">
          Powered by Flutterwave Security. High resolution 4K output.
        </p>
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange, placeholder, type = 'text', maxLength }: { 
  label: string; 
  name: string; 
  value: string; 
  onChange: (e: any) => void; 
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="editorial-label">{label}</label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="editorial-input"
        maxLength={maxLength}
      />
    </div>
  );
}
