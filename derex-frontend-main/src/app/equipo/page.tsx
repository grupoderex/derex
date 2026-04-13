import "@/assets/styles/Equipo.css";

export default function Page() {
  return (
    <div className="equipo-container">
      <div className="equipo-scroller">
        <div className="equipo-section">
          <div className="equipo-team-image flex flex-col gap-2">
            <div className="flex-grow-port-only"></div>
            <div className="equipo-title">
              <h1>UNETE A NUESTRO</h1>
              <h1>
                EQUIPO <span>JAVER</span>
              </h1>
              <h2>¡Te estamos esperando!</h2>
            </div>
            <div className="flex-grow-port-only"></div>

            <div className="equipo-search"></div>

            <p className="text-white">¿No encuentras lo que buscas?</p>

            <p className="text-white">
              Únete a nuestra comunidad de talentos y recibe notificaciones de
              nuevas oportunidades de trabajo.
            </p>
            <div className="flex-grow-port-only"></div>
            <button>¡ÚNETE A NUESTRA COMUNIDAD DE TALENTOS!</button>
          </div>
        </div>
        {/* <div className="equipo-section"></div> */}
      </div>
    </div>
  );
}