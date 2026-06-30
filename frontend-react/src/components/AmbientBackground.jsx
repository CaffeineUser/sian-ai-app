export default function AmbientBackground() {
  return (
    <>
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(255,51,75,0.05) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(80px)',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(255,193,7,0.03) 0%, transparent 70%)',
        zIndex: -1, pointerEvents: 'none', filter: 'blur(100px)',
      }} />
    </>
  );
}
