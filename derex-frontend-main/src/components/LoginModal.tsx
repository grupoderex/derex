"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { capitalizeString } from "../utils/common.utils";

import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import Image from "next/image";

const initialLoginData = {
  email: "",
  validEmail: false,
  password: "",
  validPassword: false,
  passwordVisibility: false,
  error: "",
};

const initialSignUpData = {
  firstName: "",
  validFirstName: false,
  lastName: "",
  validLastName: false,
  email: "",
  validEmail: false,
  password: "",
  validPassword: false,
  passwordVisibility: false,
  continue: false,
  confirmPassword: "",
  confirmPasswordVisibility: false,
  phone: "",
  validPhone: true,
  showPrefixPhone: false,
  acceptPolicy: false,
  error: "",
};

function validateEmail(email: string) {
  const re =
    /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return re.test(email);
}

function validatePassword(password: string) {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  return re.test(password);
}

function validateName(name: string) {
  const re = /^[a-zA-Z\s]{3,}$/;
  try {
    return re.test(name.trim());
  } catch {
    return false;
  }
}

function validatePhone(phone: string) {
  const re = /^[0-9]{9,11}$/;
  return re.test(phone);
}

export default function LoginModal() {
  const isLoginOpen = useUIStore((state) => state.isLoginOpen);
  const closeLogin = useUIStore((state) => state.closeLogin);

  const user = useAuthStore((state) => state.user);
  const loginUser = useAuthStore((state) => state.login);
  const registerUser = useAuthStore((state) => state.register);
  const logoutUser = useAuthStore((state) => state.logout);

  const [formLoginData, setFormLoginData] = useState(initialLoginData);
  const [formSignUpData, setFormSignUpData] = useState(initialSignUpData);
  const [pageLogin, setPageLogin] = useState<
    "login" | "register" | "already_in"
  >("login");
  const [privacyAlert, setPrivacyAlert] = useState(false);

  const resetAndClose = () => {
    closeLogin();
    setFormLoginData(initialLoginData);
    setFormSignUpData(initialSignUpData);
    setTimeout(() => setPageLogin("login"), 300);
  };

  useEffect(() => {
    if (user?.token && !privacyAlert) setPageLogin("already_in");
  }, [user, privacyAlert]);

  useEffect(() => {
    if (
      pageLogin === "already_in" &&
      !privacyAlert &&
      JSON.parse(localStorage.getItem("welcome") ?? "true") &&
      user
    ) {
      toast(
        `Bienvenido, ${capitalizeString(
          user.firstName ?? ""
        )} ${capitalizeString(user.lastName ?? "")}!`
      );
      localStorage.setItem("welcome", "false");
    }
  }, [pageLogin, privacyAlert, user]);

  const inputRow =
    "flex items-center gap-2 border-b border-[color:var(--light-grey)] mb-2";
  const inputLabel =
    "m-0 pt-[0.08rem] text-[0.85rem] font-bold whitespace-nowrap";
  const inputBase =
    "w-full p-2 pb-2 text-[0.85rem] font-bold text-[color:var(--main-black)] outline-none border-0 bg-transparent";
  const eyeBtn = "cursor-pointer select-none";

  const buttonBase =
    "mt-8 rounded bg-[color:var(--lightest-grey)] px-8 py-4 text-[0.9rem] font-semibold " +
    "text-[color:var(--main-grey)] capitalize mx-2";
  const buttonActive =
    "bg-[color:var(--main-red)] text-[color:var(--lightest-grey)] cursor-pointer";
  const buttonDisabled = "cursor-default";

  const promptBase = "text-center text-[0.75rem] font-bold mt-4";
  const promptTight = "mt-0";

  if (!isLoginOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[10000] flex items-center justify-center
        bg-black/25
      "
      role="dialog"
      aria-modal="true"
    >
      <div
        className="
          relative z-[999999] flex w-[450px] max-w-[100vw] flex-col items-center
          rounded bg-white p-4 text-[color:var(--main-grey)]
          text-[1.15rem] transition-all duration-1000
          max-[1000px]:w-[calc(100%-6em)] max-[1000px]:text-[2.5vh]
        "
      >
        {/* Close */}
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute right-3 top-3 h-4 w-4 cursor-pointer opacity-80 hover:opacity-100"
          aria-label="Cerrar"
        >
          {/* Ajusta ruta: debe estar en /public */}
          <Image
            src="/images/close-cross.png"
            alt="Close Cross"
            className="object-contain"
            width={16}
            height={16}
          />
        </button>

        {/* LOGIN */}
        {pageLogin === "login" && (
          <>
            <h6 className="mb-2 text-[18px] lg:text-2xl">
              ¡TE DAMOS LA BIENVENIDA!
            </h6>

            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              <div className={inputRow}>
                <p className={inputLabel}>Correo</p>
                <input
                  type="email"
                  required
                  value={formLoginData.email}
                  onChange={(e) => {
                    const v = e.target.value.trim().toLowerCase();
                    setFormLoginData((prev) => ({
                      ...prev,
                      email: v,
                      validEmail: validateEmail(v),
                      error: "",
                    }));
                  }}
                  className={inputBase}
                />
              </div>

              <div className={inputRow}>
                <p className={inputLabel}>Contraseña</p>
                <input
                  type={formLoginData.passwordVisibility ? "text" : "password"}
                  value={formLoginData.password}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormLoginData((prev) => ({
                      ...prev,
                      password: v,
                      validPassword: validatePassword(v.trim()),
                      error: "",
                    }));
                  }}
                  className={inputBase}
                />
                <div
                  className={eyeBtn}
                  onClick={() =>
                    setFormLoginData((prev) => ({
                      ...prev,
                      passwordVisibility: !prev.passwordVisibility,
                    }))
                  }
                >
                  {formLoginData.passwordVisibility ? (
                    <Icon icon="ion:ios-eye-off" width="24" />
                  ) : (
                    <Icon icon="ion:ios-eye" width="24" />
                  )}
                </div>
              </div>
            </form>

            {!formLoginData.validEmail && formLoginData.email !== "" ? (
              <div className={`${promptBase} text-red-600`}>
                El formato de email es invalido
              </div>
            ) : null}

            {!formLoginData.validPassword && formLoginData.password !== "" ? (
              <div className={`${promptBase} ${promptTight} text-red-600`}>
                La contraseña debe ser de al menos 8 caracteres, contener un
                numero, una mayuscula, una minuscula y un caracter especial
              </div>
            ) : null}

            {formLoginData.error ? (
              <div className={`${promptBase} ${promptTight} text-red-600`}>
                {formLoginData.error}
              </div>
            ) : null}

            <button
              type="button"
              className={[
                buttonBase,
                formLoginData.validEmail && formLoginData.validPassword
                  ? buttonActive
                  : buttonDisabled,
              ].join(" ")}
              onClick={async () => {
                if (!formLoginData.validEmail || !formLoginData.validPassword)
                  return;

                try {
                  const userData = await loginUser(
                    formLoginData.email,
                    formLoginData.password
                  );

                  if (Object.keys(userData).includes("error")) {
                    const dataErrors = userData as { error: string };
                    setFormLoginData({
                      ...initialLoginData,
                      error: dataErrors.error,
                    });
                    return;
                  }

                  resetAndClose();
                  setPageLogin("already_in");
                } catch {
                  setFormLoginData((prev) => ({
                    ...prev,
                    error: "Error al iniciar sesion ",
                  }));
                }
              }}
            >
              CONTINUAR
            </button>

            <button
              type="button"
              onClick={() => setPageLogin("register")}
              className="mt-4 cursor-pointer text-[0.9rem] font-bold"
            >
              Registrarse
            </button>
          </>
        )}

        {/* REGISTER */}
        {pageLogin === "register" && (
          <>
            <h6 className="text-center text-lg font-semibold">
              {formSignUpData.continue
                ? "¡SOLO UNOS PASOS MÁS!"
                : "¡TE DAMOS LA BIENVENIDA!"}
            </h6>

            <p className="px-8 text-center text-[0.85rem] font-normal">
              {!formSignUpData.continue ? (
                <>
                  Crear tu cuenta es muy sencillo. Agrega propiedades de tu
                  interés a favoritos, da seguimiento con tu agente inmobiliario
                  y mantente pendiente de las noticias de{" "}
                  <span className="font-semibold text-[color:var(--main-red)]">
                    Derex
                  </span>{" "}
                  en el newsletter.
                </>
              ) : (
                ""
              )}
            </p>

            <p className="my-4 text-center font-bold">Registrate aquí.</p>

            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              <div className={inputRow}>
                <p className={inputLabel}>Nombre</p>
                <input
                  disabled={formSignUpData.continue}
                  type="text"
                  value={formSignUpData.firstName}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    setFormSignUpData((p) => ({
                      ...p,
                      firstName: v,
                      validFirstName: validateName(v),
                    }));
                  }}
                  className={[
                    inputBase,
                    formSignUpData.continue ? "opacity-60" : "",
                  ].join(" ")}
                />
              </div>

              <div className={inputRow}>
                <p className={inputLabel}>Apellido</p>
                <input
                  disabled={formSignUpData.continue}
                  type="text"
                  value={formSignUpData.lastName}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    setFormSignUpData((p) => ({
                      ...p,
                      lastName: v,
                      validLastName: validateName(v),
                    }));
                  }}
                  className={[
                    inputBase,
                    formSignUpData.continue ? "opacity-60" : "",
                  ].join(" ")}
                />
              </div>

              <div className={inputRow}>
                <p className={inputLabel}>Correo</p>
                <input
                  disabled={formSignUpData.continue}
                  type="email"
                  value={formSignUpData.email}
                  onChange={(e) => {
                    const v = e.target.value.trim().toLowerCase();
                    setFormSignUpData((p) => ({
                      ...p,
                      email: v,
                      validEmail: validateEmail(v),
                    }));
                  }}
                  className={[
                    inputBase,
                    formSignUpData.continue ? "opacity-60" : "",
                  ].join(" ")}
                />
              </div>

              <div className={inputRow}>
                <p className={inputLabel}>Teléfono (opcional)</p>

                {(formSignUpData.phone !== "" ||
                  formSignUpData.showPrefixPhone) && (
                  <p className="pl-2 text-right text-[color:var(--main-black)]">
                    +52
                  </p>
                )}

                <input
                  disabled={formSignUpData.continue}
                  type="number"
                  onFocus={() =>
                    setFormSignUpData((p) => ({ ...p, showPrefixPhone: true }))
                  }
                  onBlur={() =>
                    setFormSignUpData((p) => ({ ...p, showPrefixPhone: false }))
                  }
                  value={formSignUpData.phone}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    setFormSignUpData((p) => ({
                      ...p,
                      phone: v,
                      validPhone: v === "" || validatePhone(v),
                    }));
                  }}
                  className={[
                    inputBase,
                    "pl-1",
                    formSignUpData.continue ? "opacity-60" : "",
                  ].join(" ")}
                />
              </div>

              {formSignUpData.continue && (
                <>
                  <div className={inputRow}>
                    <p className={inputLabel}>Contraseña</p>
                    <input
                      type={
                        formSignUpData.passwordVisibility ? "text" : "password"
                      }
                      value={formSignUpData.password}
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        setFormSignUpData((p) => ({
                          ...p,
                          password: v,
                          validPassword: validatePassword(v),
                        }));
                      }}
                      className={inputBase}
                    />
                    <div
                      className={eyeBtn}
                      onClick={() =>
                        setFormSignUpData((p) => ({
                          ...p,
                          passwordVisibility: !p.passwordVisibility,
                        }))
                      }
                    >
                      {formSignUpData.passwordVisibility ? (
                        <Icon icon="ion:ios-eye-off" width="24" />
                      ) : (
                        <Icon icon="ion:ios-eye" width="24" />
                      )}
                    </div>
                  </div>

                  <div className={inputRow}>
                    <p className={inputLabel}>Confirmar Contraseña</p>
                    <input
                      type={
                        formSignUpData.confirmPasswordVisibility
                          ? "text"
                          : "password"
                      }
                      value={formSignUpData.confirmPassword}
                      onChange={(e) =>
                        setFormSignUpData((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className={inputBase}
                    />
                    <div
                      className={eyeBtn}
                      onClick={() =>
                        setFormSignUpData((p) => ({
                          ...p,
                          confirmPasswordVisibility:
                            !p.confirmPasswordVisibility,
                        }))
                      }
                    >
                      {formSignUpData.confirmPasswordVisibility ? (
                        <Icon icon="ion:ios-eye-off" width="24" />
                      ) : (
                        <Icon icon="ion:ios-eye" width="24" />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center">
                    <input
                      id="accept-policy-check"
                      type="checkbox"
                      checked={formSignUpData.acceptPolicy}
                      onChange={(e) =>
                        setFormSignUpData((p) => ({
                          ...p,
                          acceptPolicy: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[color:var(--main-red)]"
                    />
                    <p className="ml-4 text-[12px]">
                      Al marcar esta casilla acepto haber leído y estar de
                      acuerdo con los terminos y condiciones esclarecidos por
                      derex.com.mx
                    </p>
                  </div>
                </>
              )}
            </form>

            {/* PROMPTS */}
            {!formSignUpData.validLastName && formSignUpData.lastName !== "" ? (
              <div className={`${promptBase} text-red-600`}>
                El apellido es invalido
              </div>
            ) : null}
            {!formSignUpData.validFirstName &&
            formSignUpData.firstName !== "" ? (
              <div className={`${promptBase} text-red-600`}>
                El nombre es invalido
              </div>
            ) : null}
            {!formSignUpData.validPhone && formSignUpData.phone !== "" ? (
              <div className={`${promptBase} text-red-600`}>
                El formato de telefono es invalido
              </div>
            ) : null}
            {!formSignUpData.validEmail && formSignUpData.email !== "" ? (
              <div className={`${promptBase} text-red-600`}>
                El formato de email es invalido
              </div>
            ) : null}
            {formSignUpData.confirmPassword !== formSignUpData.password &&
            formSignUpData.confirmPassword !== "" ? (
              <div className={`${promptBase} text-red-600`}>
                Las contraseñas no coinciden
              </div>
            ) : null}
            {!formSignUpData.validPassword && formSignUpData.password !== "" ? (
              <div className={`${promptBase} text-red-600`}>
                La contraseña debe ser de al menos 8 caracteres, contener un
                numero, una mayuscula, una minuscula y un caracter especial.
              </div>
            ) : null}
            {formSignUpData.error !== "" ? (
              <div className={`${promptBase} text-red-600`}>
                {formSignUpData.error}
              </div>
            ) : null}

            <div className="flex items-center">
              <button
                type="button"
                onClick={async () => {
                  if (
                    !formSignUpData.continue &&
                    formSignUpData.validEmail &&
                    formSignUpData.validFirstName &&
                    formSignUpData.validLastName &&
                    formSignUpData.validPhone
                  ) {
                    setFormSignUpData((p) => ({ ...p, continue: true }));
                    return;
                  }

                  if (
                    formSignUpData.validEmail &&
                    formSignUpData.validPassword
                  ) {
                    try {
                      const result = await registerUser(
                        formSignUpData.firstName,
                        formSignUpData.lastName,
                        formSignUpData.password,
                        formSignUpData.email,
                        formSignUpData.phone
                      );

                      if (result.error) {
                        setFormSignUpData((p) => ({
                          ...initialSignUpData,
                          error: result.error!,
                        }));
                        return;
                      }

                      setPrivacyAlert(true);
                      setPageLogin("already_in");
                    } catch {
                      setFormSignUpData((p) => ({
                        ...p,
                        error: "Error al realizar el registro",
                      }));
                    }
                  }
                }}
                className={[
                  buttonBase,
                  (!formSignUpData.continue &&
                    formSignUpData.validEmail &&
                    formSignUpData.validFirstName &&
                    formSignUpData.validLastName &&
                    formSignUpData.validPhone) ||
                  (formSignUpData.continue && formSignUpData.acceptPolicy)
                    ? buttonActive
                    : buttonDisabled,
                ].join(" ")}
              >
                {formSignUpData.continue ? "FINALIZAR" : "CONTINUAR"}
              </button>
            </div>
          </>
        )}

        {/* PRIVACY ALERT */}
        {privacyAlert && (
          <>
            <h6 className="text-center text-lg font-semibold">
              ¡GRACIAS POR TU REGISTRO!
            </h6>

            <p className="mt-4 px-8 text-[0.85rem] font-normal text-justify">
              Hola{" "}
              <span className="font-semibold text-[color:var(--main-red)]">
                {capitalizeString(user?.firstName ?? "")}
              </span>
              , somos concientes de que las suscripciones pueden crear una
              cantidad de correos innecesarios en nuestra bandeja. Es por eso
              que en Derex sólo enviamos información que consideramos relevante
              para tu experiencia. Queremos estar cerca de ti y ayudarte a
              encontrar tu nuevo hogar.
            </p>

            <div className="my-8 w-full border-t border-[color:var(--light-grey)]" />

            <div className="mb-8 mt-4 flex w-full justify-center opacity-50">
              <Image
                src="/images/footer-logo.png"
                width={200}
                height={50}
                alt="Derex"
                className="object-contain"
              />
            </div>
          </>
        )}

        {/* ALREADY IN */}
        {pageLogin === "already_in" && !privacyAlert && (
          <>
            <h6 className="text-center">
              {`Hola ${capitalizeString(
                user?.firstName ?? ""
              )} ${capitalizeString(
                user?.lastName ?? ""
              )} ¡Ya has iniciado sesión!`}
            </h6>

            <button
              type="button"
              className={[buttonBase, buttonActive].join(" ")}
              onClick={() => {
                resetAndClose();
                logoutUser();
                setPageLogin("login");
                localStorage.setItem("welcome", "true");
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
