// The BRAINCLOUD heading. Clicking it switches between the dark and pink themes.
export default function Title({ small = false }) {
  const toggleTheme = () => document.body.classList.toggle('pink-theme');

  return (
    <h1 className={small ? 'title title-small' : 'title'} onClick={toggleTheme}>
      BRAINCLOUD
    </h1>
  );
}
