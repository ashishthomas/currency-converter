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

    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="mb-6 text-3xl font-bold text-gray-800 text-center tracking-wide">
        💱 Currency Converter
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          title="From Currency"
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          handleFavorite={handleFavorite}
        />

        <div className="flex justify-center -mb-4 sm:mb-0">
          <button
            onClick={swapCurrencies}
            className="p-3 bg-gray-100 border border-gray-300 rounded-full shadow-sm hover:bg-gray-200 hover:shadow-md transition-all"
          >
            <HiArrowsRightLeft className="text-2xl text-gray-700" />
          </button>
        </div>

        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          currency={toCurrency}
          setCurrency={setToCurrency}
          title="To Currency"
          handleFavorite={handleFavorite}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="amount" className="text-sm font-semibold text-gray-700">
          Amount
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={convertCurrency}
          className={`px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition
          ${converting ? "animate-pulse" : ""}`}
        >
          Convert
        </button>
      </div>

      {convertedAmount && (
        <div className="mt-6 text-2xl font-semibold text-right text-green-600">
          ➤ {convertedAmount}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
