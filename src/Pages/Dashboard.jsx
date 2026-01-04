import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { parkingAPI } from '../services/api';

/* Plan on 200 spots */
const ALL_PARKING_SPOTS = Array.from({ length: 5 }, (_, blockIndex) => {
  const letter = String.fromCharCode(65 + blockIndex); // A, B, C, D, E
  return Array.from({ length: 40 }, (_, i) => ({
    location: `${letter}-${String(i + 1).padStart(2, '0')}`,
    pricePerHour: 10.00,  // default price
  }));
}).flat();

const ParkingSpot = ({ spot, onBook }) => {
  const isAvailable = spot.available ?? true;
  const isReal = spot.id !== undefined;

  const handleClick = () => {
    if (!isReal) return;
    if (isAvailable) {
      onBook(spot, 'book');
    } else {
      // on this moment you can cancel any place
      onBook(spot, 'cancel');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isReal}
      className={`
        relative w-10 h-12 xs:w-11 xs:h-13 sm:w-12 sm:h-14 md:w-14 md:h-16
        rounded border-2 flex items-center justify-center
        font-bold text-xs xs:text-sm sm:text-base shadow-md transition-all duration-200
        ${!isReal
          ? 'bg-gray-800 border-gray-700 opacity-40 cursor-not-allowed'
          : isAvailable
            ? 'bg-green-900 border-green-500 hover:bg-green-800 hover:border-samuraiRed hover:shadow-lg cursor-pointer'
            : 'bg-bloodRed border-samuraiRed opacity-90 hover:opacity-100 hover:border-bloodRed hover:shadow-lg cursor-pointer'
        }
      `}
      title={spot.location}
    >
      <span className={isReal ? 'text-goldAccent drop-shadow' : 'text-gray-600'}>
        {spot.location.split('-')[1]}
      </span>
      {!isReal && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg text-gray-600 opacity-60">?</span>
        </div>
      )}
      {!isAvailable && isReal && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl text-white opacity-80">✖</span>
        </div>
      )}
    </button>
  );
};

/* Parking block */
const ParkingBlock = ({ blockLetter, spots, onBook, currentUserId }) => {
  const blockSpots = spots.filter(s => s.location.startsWith(blockLetter));

  const fullBlock = Array.from({ length: 40 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    const location = `${blockLetter}-${num}`;
    return blockSpots.find(s => s.location === location) || { location };
  });

  const topLeft = fullBlock.slice(0, 10);
  const topRight = fullBlock.slice(10, 20);
  const bottomLeft = fullBlock.slice(20, 30);
  const bottomRight = fullBlock.slice(30, 40);

  const Row = ({ left, right }) => (
    <div className="flex justify-center gap-4 xs:gap-6 sm:gap-12">
      <div className="grid grid-cols-5 gap-1 xs:gap-2 sm:gap-3">
        {left.map(s => (
          <ParkingSpot key={s.location} spot={s} onBook={onBook} currentUserId={currentUserId} />
        ))}
      </div>
      <div className="w-8 xs:w-12 sm:w-20 bg-gradient-to-b from-transparent via-samuraiRed to-transparent opacity-20 rounded-full" />
      <div className="grid grid-cols-5 gap-1 xs:gap-2 sm:gap-3">
        {right.map(s => (
          <ParkingSpot key={s.location} spot={s} onBook={onBook} currentUserId={currentUserId} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-darkSlate to-deepBlack rounded-xl p-4 xs:p-6 sm:p-8 border-4 border-samuraiRed shadow-xl w-full max-w-4xl">
      <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-center mb-4 xs:mb-6 sm:mb-8 text-goldAccent tracking-wider">
        Block {blockLetter}
      </h3>
      <div className="space-y-4 xs:space-y-6 sm:space-y-10">
        <Row left={topLeft} right={topRight} />
        <div className="h-8 xs:h-12 sm:h-16 bg-gradient-to-r from-transparent via-samuraiRed to-transparent opacity-30 rounded-full mx-auto w-full max-w-md xs:max-w-xl" />
        <Row left={bottomLeft} right={bottomRight} />
      </div>
    </div>
  );
};

/* Modals */
const PaymentModal = ({ spot, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
      <div className="bg-darkSlate p-8 rounded-2xl border-4 border-samuraiRed max-w-md w-full shadow-2xl">
        <h3 className="text-3xl font-bold text-center mb-6 text-goldAccent">Confirm Booking</h3>
        <p className="text-center text-xl mb-8">
          Book spot <span className="text-samuraiRed font-bold">{spot.location}</span> for 1 hour?
          <br />
          <span className="text-4xl text-samuraiRed font-bold mt-4 block">
            {(spot.pricePerHour || 10).toFixed(2)} $
          </span>
        </p>
        <p className="text-center text-sm text-gray-400 mb-8">
          Fake payment for MVP — no real money will be charged
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-samuraiRed hover:bg-bloodRed rounded-lg font-bold text-xl transition transform hover:scale-105"
          >
            Pay & Book
          </button>
        </div>
      </div>
    </div>
  );
};

const CancelModal = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
      <div className="bg-darkSlate p-8 rounded-2xl border-4 border-samuraiRed max-w-md w-full shadow-2xl">
        <h3 className="text-3xl font-bold text-center mb-6 text-bloodRed">Cancel Booking?</h3>
        <p className="text-center text-xl mb-8">
          Do you really want to cancel this booking?
          <br />
          <span className="text-sm text-gray-400">No refund will be issued (MVP)</span>
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition"
          >
            No, keep it
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-bloodRed hover:bg-red-800 rounded-lg font-bold text-xl transition transform hover:scale-105"
          >
            Yes, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'book' or 'cancel'
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [currentRent, setCurrentRent] = useState(null); // save active rent

  const loadSpots = async () => {
    try {
      const res = await parkingAPI.getAllSpots();
      const realSpots = res.data;

      const merged = ALL_PARKING_SPOTS.map(plan => {
        const real = realSpots.find(s => s.location === plan.location);
        return real || plan;
      });

      setSpots(merged);
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки карты парковки');
    } finally {
      setLoading(false);
    }
  };

  // Download active rent on start
  const loadMyActiveRent = async () => {
    try {
      const res = await parkingAPI.getMyActiveRent();
      if (res.status === 200) {
        setCurrentRent(res.data);
      }
    } catch (err) {
      if (err.response?.status !== 204) {
        console.error("Error of getting active rent", err);
      }
      setCurrentRent(null);
    }
  };

  useEffect(() => {
    loadSpots();
    loadMyActiveRent();
  }, []);

  const handleAction = (spot, type) => {
    if (!spot.id) return;

    setSelectedSpot(spot);
    setModalType(type);
  };

  const confirmBook = async () => {
    try {
      const res = await parkingAPI.bookSpot(selectedSpot.id);
      setCurrentRent(res.data); // ← сохраняем rentId и данные аренды
      await loadSpots(); // обновляем карту
      alert(`Spot ${selectedSpot.location} book successfully!`);
    } catch (err) {
      alert('Booking error');
      console.error(err);
    } finally {
      setModalType(null);
      setSelectedSpot(null);
    }
  };

  const confirmCancel = async () => {
    if (!currentRent?.id) {
      alert('Do not have active bookings');
      return;
    }

    try {
      await parkingAPI.cancelRent(currentRent.id);
      setCurrentRent(null);
      await loadSpots();
      alert('Booking successfully canceled');
    } catch (err) {
      alert('Booking cancellation errorы');
      console.error(err);
    } finally {
      setModalType(null);
      setSelectedSpot(null);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSpot(null);
  };


  const userOccupiedSpot = currentRent ? currentRent.parkingSpot : null;

  const blocks = ['A', 'B', 'C', 'D', 'E'];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-goldAccent tracking-widest">
          Parking Map — 200 Spots
        </h2>

        {/* Status of booking */}
        {currentRent && (
          <div className="text-center mb-8 p-4 bg-samuraiRed/20 border-2 border-samuraiRed rounded-xl max-w-md mx-auto">
            <p className="text-xl text-goldAccent font-bold">
              Вы арендовали место: <span className="text-2xl">{currentRent.parkingSpot.location}</span>
            </p>
            <button
              onClick={() => setModalType('cancel')}
              className="mt-4 px-6 py-3 bg-bloodRed hover:bg-red-800 rounded-lg font-bold text-xl transition"
            >
              Отменить аренду
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center text-xl text-gray-400">Загрузка карты...</p>
        ) : (
          <div className="flex flex-col items-center gap-12 sm:gap-20">
            {blocks.map(letter => (
              <ParkingBlock
                key={letter}
                blockLetter={letter}
                spots={spots}
                onBook={handleAction}
                currentUserId={currentRent?.user?.id}
                userOccupiedSpot={userOccupiedSpot}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {modalType === 'book' && selectedSpot && (
          <PaymentModal
            spot={selectedSpot}
            onConfirm={confirmBook}
            onClose={closeModal}
          />
        )}

        {modalType === 'cancel' && (
          <CancelModal
            onConfirm={confirmCancel}
            onClose={closeModal}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
