export default function Newsletter() {
  return (
    <section className="bg-white">
      <div className="container py-14 text-center">
        <h3 className="font-display text-2xl">Rejoignez la maison</h3>
        <p className="text-gray-600 mt-2">
          Recevez nos nouveautés et offres exclusives.
        </p>
        <form
          className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
          //   onSubmit={(e) => {
          //     e.preventDefault();
          //     // TODO: wire to backend
          //     alert("Merci !");
          //   }}
        >
          <input
            type="email"
            required
            placeholder="Votre email"
            className="px-4 py-3 rounded-full border border-gray-300 min-w-[260px] focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-black text-white hover:bg-black/90"
          >
            S’inscrire
          </button>
        </form>
      </div>
    </section>
  );
}
