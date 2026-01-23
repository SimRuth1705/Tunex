const PianoKey = ({ note, type, label, onClick, isActive }) => {
  const baseStyle = "border border-gray-300 rounded-b-md cursor-pointer select-none transition-all duration-100 relative flex items-end justify-center pb-2";
  const whiteKey = `h-48 w-14 bg-white hover:bg-gray-100 z-0 text-gray-800 font-semibold shadow-sm ${isActive ? '!bg-purple-100' : ''}`;
  const blackKey = `h-28 w-10 bg-gray-800 hover:bg-gray-700 z-10 text-white text-xs absolute -mx-5 top-0 shadow-md ${isActive ? '!bg-purple-900' : ''}`;

  return (
    <div 
      className={`${baseStyle} ${type === 'white' ? whiteKey : blackKey}`}
      onClick={() => onClick(note)}
    >
      {label}
    </div>
  );
};

export default PianoKey;