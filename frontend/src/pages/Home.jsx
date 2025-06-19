

export default function Home({ isLoggedIn }) {
  return (
    <div>
      <h2>Welcome to Our App!</h2>
      {isLoggedIn ? (
        <p>You are logged in ✅</p>
      ) : (
        <p>Please log in or register to continue.</p>
      )}
    </div>
  );
}
