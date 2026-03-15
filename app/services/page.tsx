export default function ServicesPage() {
  const services = [
    {
      name: "Dry Cleaning",
      description:
        "Professional dry cleaning for suits, dresses, and delicate garments.",
    },
    {
      name: "Laundry",
      description:
        "Wash and fold service for everyday clothing with premium detergent.",
    },
    {
      name: "Ironing",
      description:
        "Wrinkle-free ironing service to keep your clothes looking sharp.",
    },
    {
      name: "Steam Ironing",
      description:
        "High quality steam pressing to remove wrinkles and give garments a crisp professional finish.",
    },
    {
      name: "Saree Polishing",
      description:
        "Special polishing treatment to restore shine and softness to delicate silk sarees.",
    },
    {
      name: "Saree Rolling",
      description:
        "Professional saree rolling and folding to maintain fabric quality and prevent creases.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-12">
          Our Services
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          {services.map((service) => (
            <div
              key={service.name}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-3">
                {service.name}
              </h2>

              <p className="text-gray-600 text-sm">
                {service.description}
              </p>
            </div>
          ))}

        </div>

      </div>

      <div className="mt-12 text-center">

        <h2 className="text-lg font-semibold mb-2">
          Our Location
        </h2>

        <p className="text-gray-700 mb-4">
          C-2/16 CITIZEN COLONY<br/>
          INDRESHAM, PATANCHERU
        </p>

        <a
          href="https://www.google.com/maps/place/Citizen+colony/@17.5544005,78.2626567,18.21z/data=!4m10!1m2!2m1!1splot+no+c-2%2F16+citizen+colony+indresham!3m6!1s0x3bcbf3003cbd7d23:0x9e4b5cadc7235f13!8m2!3d17.5543699!4d78.2627281!15sCidwbG90IG5vIGMtMi8xNiBjaXRpemVuIGNvbG9ueSBpbmRyZXNoYW2SARFzdHVkZW50X2Rvcm1pdG9yeeABAA!16s%2Fg%2F11xl6vt9h4?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full bg-black !text-white font-semibold text-center py-3 rounded-xl hover:opacity-90"
        >
          View on Google Maps
        </a>

      </div>
    </main>
  );
}