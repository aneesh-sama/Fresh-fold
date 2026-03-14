import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-6 py-20">

      {/* HERO SECTION */}
      <section className="mb-20 flex flex-col items-center">

        <Image
          src="/logo.jpeg"
          alt="Fresh Fold Logo"
          width={200}
          height={200}
          className="mb-6"
        />

        <h1 className="text-5xl font-bold mb-6">
          Fresh Fold Dry Cleaners
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Professional laundry and dry cleaning with convenient pickup and delivery.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/schedule"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Schedule Pickup
          </a>

          <a
            href="/services"
            className="border border-gray-400 px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            View Services
          </a>
        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">

          <div>
            <h3 className="font-semibold text-xl mb-2">1. Schedule Pickup</h3>
            <p className="text-gray-600">
              Choose a convenient pickup time from our website.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-2">2. We Clean</h3>
            <p className="text-gray-600">
              Our professionals clean and prepare your clothes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-2">3. We Deliver</h3>
            <p className="text-gray-600">
              Your clothes are delivered fresh and ready to wear.
            </p>
          </div>

        </div>
      </section>


      {/* CONTACT US */}
      <section className="border-t pt-10 max-w-xl">

        <h2 className="text-2xl font-bold mb-4">
          Contact Us
        </h2>

        <p className="text-gray-600 mb-2">
          Phone: <span className="font-medium">+91 8886966262</span>
        </p>

        <p className="text-gray-600">
          Email: <span className="font-medium">veniyadav9@gmail.com</span>
        </p>

      </section>

    </main>
  );
}