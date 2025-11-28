import { useState, useEffect } from "react";
import CurrencyDropdown from "./dropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
  );

  const fetchCurrencies = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencies(Object.keys(data));
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    if (!amount) return;
    setConverting(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
    } catch (error) {
      console.error("Error Fetching", error);
    } finally {
      setConverting(false);
    }
  };

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];
    updatedFavorites = favorites.includes(currency)
      ? favorites.filter((fav) => fav !== currency)
      : [...favorites, currency];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div
      className="
      min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-black
    "
    >
      {/* Neon glow ring */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-2xl -z-10"></div>

      <h2 className="mb-8 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 tracking-wide drop-shadow-lg">
        ✨ Currency Converter
      </h2>

      {/* Form section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-end">
        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          title="From"
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          handleFavorite={handleFavorite}
        />

        <div className="flex justify-center -mb-6 sm:mb-0">
          <button
            onClick={swapCurrencies}
            className="
              p-4 rounded-full 
              bg-slate-700/40 border border-slate-600 
              shadow-lg backdrop-blur 
              hover:scale-110 hover:shadow-[0_0_20px_#5ac4ff90]
              transition-all duration-300
            "
          >
            <HiArrowsRightLeft className="text-3xl text-cyan-300" />
          </button>
        </div>

        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          title="To"
          currency={toCurrency}
          setCurrency={setToCurrency}
          handleFavorite={handleFavorite}
        />
      </div>

      {/* Amount input */}
      <div className="mt-8">
        <label
          htmlFor="amount"
          className="text-sm font-semibold text-slate-300"
        >
          Amount
        </label>

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          id="amount"
          className="
            w-full p-4 mt-2 
            rounded-xl bg-slate-800 text-slate-100 text-xl 
            border border-slate-600
            shadow-inner
            focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 
            transition
          "
        />
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={convertCurrency}
          className="
            px-8 py-3 rounded-xl 
            bg-gradient-to-r from-cyan-500 to-indigo-500 
            text-white font-bold text-lg 
            shadow-lg shadow-indigo-700/40 
            hover:scale-105 hover:shadow-indigo-500/60
            transition-all duration-300
          "
        >
          {converting ? "Processing..." : "Convert"}
        </button>
      </div>

      {convertedAmount && (
        <div
          className="
          mt-8 text-3xl font-bold text-right 
          bg-gradient-to-r from-green-400 to-emerald-300 
          text-transparent bg-clip-text drop-shadow-lg
        "
        >
          ➤ {convertedAmount}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
