function App() {
  const handleClick = () => {
    const testButton = {
      status: "success",
    };
    console.log("Hello world!, testButton:", testButton);
    alert("Hello world!, testButton: " + JSON.stringify(testButton));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#3d407b]">
      <h1 className="text-3xl font-bold text-sky-100">Hello world!</h1>
      <p className="text-sky-100">This is Flowspace Client.</p>

      <button
        onClick={handleClick}
        className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-900 active:bg-blue-900"
      >
        Klik
      </button>
    </div>
  );
}

export default App;
