"use client";

// React Imports
import { useEffect, useState } from "react";

// Next Imports
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// MUI Imports
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
// Third-party Imports
import { signIn, useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, minLength, string, pipe, nonEmpty } from "valibot";
import type { SubmitHandler } from "react-hook-form";
import type { InferInput } from "valibot";
import classnames from "classnames";

// Type Imports
import type { SystemMode } from "@core/types";
import type { Locale } from "@/configs/i18n";

// Component Imports
import Logo from "@components/layout/shared/Logo";
import CustomTextField from "@core/components/mui/TextField";

// Hook Imports
import { useImageVariant } from "@core/hooks/useImageVariant";
import { useSettings } from "@core/hooks/useSettings";

// Util Imports
import { getLocalizedUrl } from "@/utils/i18n";
import { toast } from "react-toastify";
import { getDictionary } from "@/utils/getDictionary";
import { Collapse } from "@mui/material";

// Styled Custom Components
const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  blockSize: "auto",
  maxBlockSize: 580,
  maxInlineSize: "100%",
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxBlockSize: 450,
  },
}));

const MaskImg = styled("img")({
  blockSize: "auto",
  maxBlockSize: 355,
  inlineSize: "100%",
  position: "absolute",
  insetBlockEnd: 0,
  zIndex: -1,
});

type ErrorType = {
  message: string[];
};

type FormData = InferInput<typeof schema>;

const schema = object({
  username: pipe(string(), minLength(1, "This field is required")),
  password: pipe(
    string(),
    nonEmpty("This field is required"),
    minLength(5, "Password must be at least 5 characters long"),
  ),
});

const Login = ({
  mode,
  lang,
  dictionary,
}: {
  mode: SystemMode;
  lang: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) => {
  // States
  const [loading, setLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [errorState, setErrorState] = useState<ErrorType | null>(null);

  // Vars
  const darkImg = "/images/pages/auth-mask-dark.png";
  const lightImg = "/images/pages/auth-mask-light.png";
  const darkIllustration = "/images/illustrations/auth/v2-login-dark.png";
  const lightIllustration = "/images/logos/login-poster.png";
  const borderedDarkIllustration =
    "/images/illustrations/auth/v2-login-dark-border.png";
  const borderedLightIllustration =
    "/images/illustrations/auth/v2-login-light-border.png";

  // Hooks
  const { data: session } = useSession();

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams() as { lang: string };
  const locale = params.lang;
  const { settings } = useSettings();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const authBackground = useImageVariant(mode, lightImg, darkImg);

  const initial = {
    username: "",
    password: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: initial,
  });

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration,
  );

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      // const redirectURL = searchParams.get('/') ?? '/';
      // router.replace(getLocalizedUrl(redirectURL, locale as Locale));
      setLoading(true);
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (res && res.ok && res.error === null) {
        toast.success(dictionary.authenticated);
        // Vars
        const redirectURL = searchParams?.get("redirectTo") ?? "/";
        router.replace(getLocalizedUrl(redirectURL, locale as Locale));
        setLoading(false);
      } else {
        setLoading(false);
        if (res?.error) {
          toast.error(dictionary.invalidCredentials);
        }
      }
    } catch (e) {
      setLoading(false);
      toast.error(dictionary.invalidCredentials);
    }
  };

  useEffect(() => {
    if (session?.user?.empId && session?.user?.level) {
      router.replace(getLocalizedUrl("/", locale as Locale));
    }
  }, [session]);

  return (
    <div className="flex bs-full justify-center">
      <div
        className={classnames(
          "flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden",
          {
            "border-ie": settings.skin === "bordered",
          },
        )}
      >
        <LoginIllustration
          src={characterIllustration}
          alt="character-illustration"
        />
        {!hidden && <MaskImg alt="mask" src={authBackground} />}
      </div>
      <div className="flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]">
        <div className="absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]">
          <Logo />
        </div>
        <div className="flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0">
          <div className="flex flex-col gap-1">
            <Typography variant="h4">{dictionary.welcomeToLaoWorld}</Typography>
            <Typography>{dictionary.pleaseSignInToAdventure}</Typography>
          </div>
          <form
            noValidate
            autoComplete="off"
            action={() => {}}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Controller
              disabled={loading}
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type="text"
                  label={`${dictionary.username}`}
                  placeholder="username"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    errorState !== null && setErrorState(null);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="tabler-user" />
                      </InputAdornment>
                    ),
                  }}
                  {...((errors.username || errorState !== null) && {
                    error: true,
                    helperText:
                      errors?.username?.message || errorState?.message[0],
                  })}
                />
              )}
            />
            <Controller
              disabled={loading}
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={dictionary.password}
                  placeholder="············"
                  id="login-password"
                  type={isPasswordShown ? "text" : "password"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    errorState !== null && setErrorState(null);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="tabler-lock" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <i
                            className={
                              isPasswordShown ? "tabler-eye" : "tabler-eye-off"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...(errors.password && {
                    error: true,
                    helperText: errors.password.message,
                  })}
                />
              )}
            />

            <Button fullWidth variant="contained" type="submit">
              <Collapse
                sx={{ mt: "5px" }}
                unmountOnExit={true}
                orientation={"horizontal"}
                in={loading}
              >
                <i className="tabler-loader animate-spin text-base mr-2" />
              </Collapse>
              {dictionary.login}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
