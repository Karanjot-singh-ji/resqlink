import React, { useState } from 'react';
import { DollarSign, Heart, Package, TrendingUp, Target, Gift } from 'lucide-react';
import { Crisis, Donation, User } from '../types';

interface DonationCenterProps {
  user: User;
  crises: Crisis[];
  donations: Donation[];
  onMakeDonation: (donation: Omit<Donation, 'id'>) => void;
}

export default function DonationCenter({ user, crises, donations, onMakeDonation }: DonationCenterProps) {
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null);
  const [donationType, setDonationType] = useState<'monetary' | 'goods'>('monetary');
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [goodsItems, setGoodsItems] = useState([{ name: '', quantity: 0, unit: '' }]);

  const handleQuickDonate = (amount: number, crisisId: string) => {
    onMakeDonation({
      donorId: user.id,
      donorName: isAnonymous ? 'Anonymous Donor' : user.name,
      crisisId,
      type: 'monetary',
      amount,
      currency: 'USD',
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      anonymous: isAnonymous
    });
  };

  const handleCustomDonation = () => {
    if (!selectedCrisis) return;

    if (donationType === 'monetary') {
      onMakeDonation({
        donorId: user.id,
        donorName: isAnonymous ? 'Anonymous Donor' : user.name,
        crisisId: selectedCrisis.id,
        type: 'monetary',
        amount: donationAmount,
        currency: 'USD',
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        anonymous: isAnonymous
      });
    } else {
      onMakeDonation({
        donorId: user.id,
        donorName: isAnonymous ? 'Anonymous Donor' : user.name,
        crisisId: selectedCrisis.id,
        type: 'goods',
        items: goodsItems.filter(item => item.name && item.quantity > 0),
        status: 'pledged',
        timestamp: new Date().toISOString(),
        anonymous: isAnonymous
      });
    }

    // Reset form
    setSelectedCrisis(null);
    setDonationAmount(0);
    setGoodsItems([{ name: '', quantity: 0, unit: '' }]);
  };

  const addGoodsItem = () => {
    setGoodsItems([...goodsItems, { name: '', quantity: 0, unit: '' }]);
  };

  const updateGoodsItem = (index: number, field: string, value: any) => {
    const updated = goodsItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setGoodsItems(updated);
  };

  const removeGoodsItem = (index: number) => {
    setGoodsItems(goodsItems.filter((_, i) => i !== index));
  };

  const activeCrises = crises.filter(c => c.status === 'active');
  const myDonations = donations.filter(d => d.donorId === user.id);
  const totalDonated = myDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const getFundingProgress = (crisis: Crisis) => {
    return Math.min((crisis.totalFunding / crisis.fundingGoal) * 100, 100);
  };

  const getUrgencyLevel = (crisis: Crisis) => {
    const progress = getFundingProgress(crisis);
    if (progress < 25) return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (progress < 50) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (progress < 75) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Make a Difference Today</h2>
            <p className="text-purple-100">Your generosity can save lives and restore hope</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${(totalDonated / 1000).toFixed(1)}K</div>
            <div className="text-sm text-purple-100">Your Total Impact</div>
          </div>
        </div>
      </div>

      {/* Quick Donate Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Quick Donate to Urgent Crises
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeCrises.slice(0, 4).map((crisis) => {
            const urgency = getUrgencyLevel(crisis);
            const progress = getFundingProgress(crisis);
            
            return (
              <div key={crisis.id} className={`border rounded-lg p-4 ${urgency.bg} ${urgency.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{crisis.title}</h4>
                    <p className="text-sm text-gray-600">{crisis.location}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${urgency.bg} ${urgency.color}`}>
                    {urgency.level}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{crisis.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-medium">
                      ${(crisis.totalFunding / 1000).toFixed(0)}K / ${(crisis.fundingGoal / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% funded</div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleQuickDonate(amount, crisis.id)}
                      className="bg-white text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedCrisis(crisis)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Custom Donation
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Donations History */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          My Donation History
        </h3>
        <div className="space-y-4">
          {myDonations.slice(0, 5).map((donation) => {
            const crisis = crises.find(c => c.id === donation.crisisId);
            return (
              <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    donation.type === 'monetary' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {donation.type === 'monetary' ? 
                      <DollarSign className="h-5 w-5 text-green-600" /> :
                      <Package className="h-5 w-5 text-blue-600" />
                    }
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{crisis?.title || 'Crisis Relief'}</h4>
                    <p className="text-sm text-gray-600">
                      {donation.type === 'monetary' 
                        ? `$${donation.amount?.toLocaleString()} donated`
                        : `${donation.items?.length || 0} items donated`
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    donation.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    donation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {donation.status}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(donation.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Donation Modal */}
      {selectedCrisis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCrisis.title}</h3>
                <p className="text-gray-600">{selectedCrisis.location}</p>
              </div>
              <button
                onClick={() => setSelectedCrisis(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Funding Progress</span>
                <span className="font-medium">
                  ${(selectedCrisis.totalFunding / 1000).toFixed(0)}K / ${(selectedCrisis.fundingGoal / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${getFundingProgress(selectedCrisis)}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDonationType('monetary')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      donationType === 'monetary'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">Monetary</div>
                  </button>
                  <button
                    onClick={() => setDonationType('goods')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      donationType === 'goods'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Package className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">Goods</div>
                  </button>
                </div>
              </div>

              {donationType === 'monetary' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter amount"
                  />
                  <div className="flex space-x-2 mt-2">
                    {[25, 50, 100, 250, 500].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items to Donate</label>
                  {goodsItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updateGoodsItem(index, 'name', e.target.value)}
                        className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateGoodsItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={item.unit}
                        onChange={(e) => updateGoodsItem(index, 'unit', e.target.value)}
                        className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      {goodsItems.length > 1 && (
                        <button
                          onClick={() => removeGoodsItem(index)}
                          className="col-span-1 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addGoodsItem}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add Item
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCustomDonation}
                  disabled={donationType === 'monetary' ? donationAmount <= 0 : goodsItems.every(item => !item.name || item.quantity <= 0)}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Gift className="h-5 w-5 inline mr-2" />
                  Donate Now
                </button>
                <button
                  onClick={() => setSelectedCrisis(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}