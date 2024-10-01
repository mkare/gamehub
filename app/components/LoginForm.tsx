"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks"; // Redux custom hooks
import { loginUser, logout } from "@/app/store/authSlice"; // Importing the thunk

interface LoginFormProps {
  onSignUp?: () => void;
}

const LoginForm = ({ onSignUp }: LoginFormProps) => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Geçersiz e-posta adresi")
        .required("E-posta gerekli"),
      password: Yup.string().required("Şifre gerekli"),
    }),
    onSubmit: async (values) => {
      dispatch(loginUser(values)); // Dispatch the loginUser thunk with form values
    },
  });

  if (user) {
    return (
      <div className="login-form">
        <div className="user-loggedin">
          <div>
            <p>Giriş yapıldı!</p>
            <p>Email: {user.email}</p>
          </div>
          <button
            className="mt-2 btn btn-light"
            onClick={() => dispatch(logout())}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-form">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-danger">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-danger">{formik.errors.password}</div>
          ) : null}
        </div>
        <button type="submit" className="btn btn-light" disabled={loading}>
          {loading ? "Yükleniyor..." : "Giriş Yap"}
        </button>
        {error && <div className="mt-2 text-danger">{error}</div>}
      </form>
    </div>
  );
};

export default LoginForm;
