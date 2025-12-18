import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateuserprofile, getUser } from '../../redux/slices/authSlice';

const Profile = () => {
  const [selectedGender, setSelectedGender] = useState(null);

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newMobile, setNewMobile] = useState('');

  const [name, setName] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);

  const [location, setLocation] = useState('');
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const [birthdate, setBirthdate] = useState('');
  const [isBirthdateFocused, setIsBirthdateFocused] = useState(false);
  const [birthdateInputType, setBirthdateInputType] = useState('text');

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isEmailInputFocused, setIsEmailInputFocused] = useState(false);

  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  // Format Birthdate
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const profile = useSelector((state) => state.auth);
  const loggendInUser = useSelector((state) => state.auth.id);
  const user = profile?.users?.find((user) => user._id === loggendInUser);
  const dispatch = useDispatch();

  useEffect(() => {
    let called = false;
    if (!called) {
      dispatch(getUser());
      called = true;
    }
  }, []);


  useEffect(() => {
    if (profile) {
      setName(user?.name || '');
      setLocation(user?.location || '');
      // Handle both birthDate and brithdate (typo) for backward compatibility
      const birthDateValue = user?.birthdate || user?.birthate;
      setBirthdate(birthDateValue ? new Date(birthDateValue).toISOString().split('T')[0] : '');
      if (birthDateValue) {
        setBirthdateInputType('date');
      }
      setSelectedGender(user?.gender || null);
      setEmail(user?.email);
      setIsNewsletterSubscribed(user?.isnewslettersubscribed || false);
    }
  }, [profile]);

  const handleUpdateProfile = () => {
    const updateData = {
      name,
      location,
      birthdate: birthdate || null,
      gender: selectedGender,
      email: email || newEmail,
      isnewslettersubscribed: isNewsletterSubscribed,
    };

    dispatch(updateuserprofile(updateData))
      .unwrap()
      .then(() => {
        dispatch(getUser());
      })
      .catch((err) => {
        console.error('Failed to update profile:', err);
      });
  };

  return (
    <>
      {/* MAIN FORM */}
      <div className="space-y-8">
        <div className="bg-white border border-gray-300 rounded-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-5">
              <div className="relative w-full mb-5">
                <label
                  className={`absolute left-3 transition-all duration-200
                    ${isNameFocused || name
                      ? 'text-[12px] -top-2 text-[#b4853e] bg-white px-1'
                      : 'text-[13px] top-3 text-gray-400'
                    } pointer-events-none`}
                >
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded focus:outline-none text-[13px]"
                />
              </div>


              {/* Birthdate */}
              <div className="relative w-full mb-5">
                <label
                  className={`absolute left-3 transition-all duration-200
                    ${isBirthdateFocused || birthdate
                      ? 'text-[12px] -top-2 text-[#b4853e] bg-white px-1'
                      : 'text-[13px] top-3 text-gray-400'
                    } pointer-events-none`}
                >
                  Birthdate
                </label>
                <input
                  type={birthdateInputType}
                  value={birthdateInputType === 'text' ? formatDateDisplay(birthdate) : birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  onFocus={() => {
                    setIsBirthdateFocused(true);
                    setBirthdateInputType('date');
                  }}
                  onBlur={() => {
                    setIsBirthdateFocused(false);
                    if (!birthdate) setBirthdateInputType('text');
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded focus:outline-none text-[13px]"
                />
              </div>
            </div>

            {/* Location + Email */}
            <div className="space-y-5">
              {/* Location Input */}
              <div className="relative w-full mb-5">
                <label
                  className={`absolute left-3 transition-all duration-200
                    ${isLocationFocused || location
                      ? 'text-[12px] -top-2 text-[#b4853e] bg-white px-1'
                      : 'text-[13px] top-3 text-gray-400'
                    } pointer-events-none`}
                >
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setIsLocationFocused(true)}
                  onBlur={() => setIsLocationFocused(false)}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded focus:outline-none text-[13px]"
                />
              </div>

              {/* Email Section */}
              <div className="flex items-center border border-gray-300 rounded">
                <input
                  type="email"
                  value={email}
                  disabled
                  placeholder="Email Id"
                  className="flex-1 pt-3 px-3 py-2 rounded-l outline-none bg-gray-100 cursor-not-allowed text-[13px]"
                />
                <button
                  className="px-4 text-[#b4853e] font-medium text-[12px]"
                  onClick={() => setShowEmailModal(true)}
                >
                  ADD
                </button>
              </div>

              {/* Email Modal */}
              {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-start sm:justify-center bg-black/50 bg-opacity-80 p-4">
                  <div className="bg-white w-[75%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[25%] shadow-lg p-6 relative sm:mx-auto rounded-sm">
                    <button
                      className="absolute top-3 right-4 text-xl text-gray-500"
                      onClick={() => setShowEmailModal(false)}
                    >
                      &times;
                    </button>

                    <h2 className="text-[16px] font-medium mb-1">Add Email</h2>
                    <p className="text-[14px] text-[#696661] mb-7">
                      Please enter your email address.
                    </p>

                    <div className="relative w-full mb-6">
                      <label
                        className={`absolute left-3 transition-all duration-200
                          ${isEmailInputFocused || newEmail
                            ? 'text-[12px] -top-2 text-[#b4853e] bg-white px-1'
                            : 'text-[13px] top-3 text-gray-400'
                          } pointer-events-none`}
                      >
                        Email Id
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onFocus={() => setIsEmailInputFocused(true)}
                        onBlur={() => setIsEmailInputFocused(false)}
                        className="w-full px-3 pt-5 pb-2 border border-[#b4853e] rounded focus:outline-none text-[13px]"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        className="px-4 text-[13px] border border-gray-300 hover:bg-gray-100 rounded"
                        onClick={() => setShowEmailModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#b4853e] text-white px-5 py-2 text-[13px] hover:bg-[#a06e2a] rounded"
                        onClick={() => {
                          setEmail(newEmail);
                          setShowEmailModal(false);
                          dispatch(updateuserprofile({ email: newEmail }));
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="lg:col-span-1">
              <p className="text-sm text-gray-700 mb-2">Gender (Optional)</p>
              <div className="flex gap-3">
                {genderOptions.map((gender) => {
                  const isSelected = selectedGender === gender;
                  return (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setSelectedGender(gender)}
                      className={`flex-1 py-2 border rounded font-medium text-sm transition-all
                        ${isSelected
                          ? 'bg-[#f5efe8] text-[#b4853e] border-[#b4853e]'
                          : 'border-gray-300 text-gray-800 hover:bg-gray-100'
                        }`}
                    >
                      {isSelected && '✓ '} {gender}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 accent-amber-600"
              checked={isNewsletterSubscribed}
              onChange={(e) => setIsNewsletterSubscribed(e.target.checked)}
            />
            <span className="text-[13px] text-gray-700">
              Keep up with our latest news and events. Subscribe to our newsletter.
            </span>
          </div>

          {/* Submit */}
          <div className="mt-8 flex items-center gap-6">
            <button
              className="bg-[#b4853e] text-white px-6 py-2 rounded text-[16px] hover:bg-[#9a6f35] transition-colors"
              onClick={handleUpdateProfile}
            >
              Update Profile
            </button>
          </div>
        </div>

        <p className="text-[13px] text-gray-600">
          Do you want to delete your account permanently?{' '}
          <a href="#" className="text-[#b4853e] hover:underline">
            Click here
          </a>
        </p>
      </div>
    </>
  );
};

export default Profile;