"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AudienceChip } from "@/components/AudienceChip";
import { useAtlas } from "@/context/AtlasContext";
import { getListing, makeBookingRef } from "@/lib/data";
import { priceForListing } from "@/lib/pricing";
import { addDays, formatMoney, formatShortRange, nightsBetween } from "@/lib/dates";
import type { Category } from "@/lib/types";

const METHODS = ["bKash", "Nagad", "Visa/Mastercard", "Bank transfer"] as const;

export default function BookClient({ category, slug }: { category: Category; slug: string }) {
  const listing = getListing(category, slug);
  const { search, addBooking } = useAtlas();
  const router = useRouter();
  const [step, setStep] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [tin, setTin] = useState("");
  const [method, setMethod] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  function clearError(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  const price = useMemo(() => {
    if (!listing) return null;
    return priceForListing(listing, search.from, search.to, search.adults + search.children);
  }, [listing, search]);

  if (!listing || !price) {
    return <div className="p-8">Listing not found.</div>;
  }

  const corporate = search.audience === "Corporate";
  const cancelUntil = listing.freeCancellation
    ? addDays(search.from, -listing.cancelUntilDays)
    : null;

  function validateStep2() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter full name.";
    if (!email.trim() || !email.includes("@")) next.email = "Enter a valid email.";
    if (!mobile.trim() || mobile.replace(/\D/g, "").length < 10) next.mobile = "Enter a valid mobile number.";
    if (corporate) {
      if (!company.trim()) next.company = "Enter company name.";
      if (!billingEmail.trim() || !billingEmail.includes("@")) next.billingEmail = "Enter billing email.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function pay() {
    if (!validateStep2() || !method || !listing || !price) return;
    const id = crypto.randomUUID();
    const ref = makeBookingRef();
    addBooking({
      id,
      ref,
      listingId: listing.id,
      slug: listing.slug,
      type: listing.category,
      title: listing.title,
      location: listing.location,
      image: listing.images[0],
      from: search.from,
      to: search.to,
      audience: search.audience,
      adults: search.adults,
      children: search.children,
      guestName: name,
      guestEmail: email,
      guestMobile: `+880 ${mobile}`,
      companyName: corporate ? company : undefined,
      billingEmail: corporate ? billingEmail : undefined,
      tin: corporate ? tin || undefined : undefined,
      paymentMethod: method,
      breakdown: price,
      total: price.total,
      createdAt: new Date().toISOString(),
      status: "upcoming",
      cancelUntil: cancelUntil || search.from,
    });
    router.push(`/bookings/${id}`);
  }

  function validateSilent() {
    if (!name.trim() || !email.includes("@") || mobile.replace(/\D/g, "").length < 10) return false;
    if (corporate && (!company.trim() || !billingEmail.includes("@"))) return false;
    return true;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_340px] sm:px-6">
      <div>
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">1</span>
          Book {category === "stays" ? "stay" : "trip"}
        </div>

        <div className="space-y-3">
          <section className="rounded-card border border-slate-200 bg-white p-4">
            <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setStep(1)}>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">1</span>
                <div>
                  <p className="font-medium">Dates & guests</p>
                  <p className="text-sm text-slate-500">
                    {formatShortRange(search.from, search.to)} · {search.audience} · {search.adults} adult{search.adults > 1 ? "s" : ""}
                    {search.children ? `, ${search.children} child` : ""}
                  </p>
                </div>
              </div>
              <span className="text-sm text-coral">Edit</span>
            </button>
          </section>

          <section className="rounded-card border border-slate-200 bg-white p-4">
            <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setStep(2)}>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">2</span>
                <p className="font-medium">Guest details</p>
              </div>
            </button>
            {step === 2 && (
              <div className="mt-4 space-y-3">
                <AudienceChip label={search.audience} />
                <Field label="Full name" value={name} onChange={setName} error={errors.name} errorKey="name" clearError={clearError} placeholder="Enter full name." />
                <Field label={corporate ? "Work email" : "Email"} value={email} onChange={setEmail} error={errors.email} errorKey="email" clearError={clearError} placeholder="Enter email address." />
                <div>
                  <label className="text-sm font-medium">Mobile (+880)</label>
                  <div className="mt-1 flex gap-2">
                    <span className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-3 text-sm text-coral">+880</span>
                    <input className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm" value={mobile} onChange={(e) => { setMobile(e.target.value); clearError("mobile"); }} placeholder="Enter mobile number." />
                  </div>
                  {errors.mobile && <p className="mt-1 text-xs text-coral">{errors.mobile}</p>}
                </div>
                {corporate && (
                  <div className="rounded-xl border border-slate-100 bg-sand-50 p-3">
                    <p className="mb-3 text-sm font-semibold">Company details</p>
                    <Field label="Company name" value={company} onChange={setCompany} error={errors.company} errorKey="company" clearError={clearError} placeholder="Enter company name." />
                    <Field label="Billing email" value={billingEmail} onChange={setBillingEmail} error={errors.billingEmail} errorKey="billingEmail" clearError={clearError} placeholder="Enter billing email." />
                    <Field label="TIN / VAT" value={tin} onChange={setTin} errorKey="tin" clearError={clearError} placeholder="Enter TIN / VAT (optional)." />
                    <p className="mt-2 text-xs text-slate-500">Please ensure all details are accurate. This information will be used for invoicing.</p>
                  </div>
                )}
                <button
                  type="button"
                  className="min-h-11 rounded-pill bg-coral px-5 text-sm font-semibold text-white hover:bg-coral-700"
                  onClick={() => validateStep2() && setStep(3)}
                >
                  Continue to payment
                </button>
              </div>
            )}
          </section>

          <section className="rounded-card border border-slate-200 bg-white p-4">
            <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => validateStep2() && setStep(3)}>
              <div className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${step === 3 ? "bg-coral" : "bg-slate-300"}`}>3</span>
                <p className="font-medium">Payment</p>
              </div>
            </button>
            {step === 3 && (
              <div className="mt-4">
                <p className="mb-3 text-sm text-slate-500">Choose your preferred payment method</p>
                <p className="mb-3 rounded-xl bg-sand-50 px-3 py-2 text-xs text-slate-600">
                  Demo payment — you won’t be charged. No real money moves in this prototype.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`min-h-20 rounded-card border p-3 text-sm font-medium ${method === m ? "border-coral ring-2 ring-coral/30" : "border-slate-200"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>Total due</span>
                  <strong>{formatMoney(price.total)}</strong>
                </div>
                <button
                  type="button"
                  disabled={!method || !validateSilent()}
                  onClick={pay}
                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-pill bg-coral text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Pay BDT {price.total.toLocaleString("en-BD")} (demo)
                </button>
                <p className="mt-2 text-center text-xs text-slate-500">You won’t be charged.</p>
                {cancelUntil && (
                  <p className="mt-2 text-center text-xs text-emerald-700">
                    Free cancellation until {formatShortRange(cancelUntil, cancelUntil).split("–")[0]}. You will get a voucher by email.
                  </p>
                )}
                {corporate && (
                  <p className="mt-2 text-center text-xs text-slate-500">Invoice PDF will be available after payment.</p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <aside className="h-fit rounded-card border border-slate-200 bg-white p-4 shadow-soft lg:sticky lg:top-24">
        <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl">
          <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="340px" />
        </div>
        <h2 className="font-medium">{listing.title}</h2>
        <p className="text-sm text-slate-500">{listing.location}</p>
        <p className="mt-2 text-sm text-slate-600">
          {nightsBetween(search.from, search.to)} nights · {formatShortRange(search.from, search.to)}
        </p>
        <ul className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
          <li className="flex justify-between"><span>Room / ticket</span><span>{formatMoney(price.base)}</span></li>
          <li className="flex justify-between"><span>Service</span><span>{formatMoney(price.service)}</span></li>
          <li className="flex justify-between"><span>Tax</span><span>{formatMoney(price.tax)}</span></li>
          <li className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
            <span>Total (all-in)</span>
            <span className="text-coral">{formatMoney(price.total)}</span>
          </li>
        </ul>
        {cancelUntil && (
          <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            Free cancellation until {formatShortRange(cancelUntil, cancelUntil).split("–")[0]}
          </p>
        )}
        <Link href={`/${category}/${slug}`} className="mt-4 inline-block text-sm text-slate-600 underline">
          Back to listing
        </Link>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  errorKey,
  clearError,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  errorKey: string;
  clearError: (key: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          clearError(errorKey);
        }}
        placeholder={placeholder}
      />
      {error ? <p className="mt-1 text-xs text-coral">{error}</p> : null}
    </div>
  );
}
