interface MixedDevelopmentIconProps {
  size?: number;
  className?: string;
}

export const MixedDevelopmentIcon = ({
  size = 32,
  className,
}: MixedDevelopmentIconProps) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 21V25.5C8 26.0523 7.55228 26.5 7 26.5H3.5C2.94772 26.5 2.5 26.0523 2.5 25.5V16.0226C2.5 15.6952 2.66027 15.3885 2.92907 15.2016L10.074 10.233C10.4228 9.99048 10.8867 9.99476 11.2309 10.2437L18.086 15.2006C18.346 15.3886 18.5 15.69 18.5 16.0109V25.5C18.5 26.0523 18.0523 26.5 17.5 26.5H14.5C13.9477 26.5 13.5 26.0523 13.5 25.5V21C13.5 20.4477 13.0523 20 12.5 20H9C8.44772 20 8 20.4477 8 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 6.5L14.5021 6.34568C14.5096 5.79879 14.9551 5.35938 15.502 5.35938H28.2812C28.8335 5.35938 29.2812 5.80709 29.2812 6.35938V25.682C29.2812 26.2364 28.8302 26.685 28.2758 26.682L23.5938 26.6562"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.6 9.75C22.6 10.5784 23.2716 11.25 24.1 11.25C24.9284 11.25 25.6 10.5784 25.6 9.75C25.6 8.92157 24.9284 8.25 24.1 8.25C23.2716 8.25 22.6 8.92157 22.6 9.75Z"
        stroke="currentColor"
      />
      <path
        d="M22.6 15.75C22.6 16.5784 23.2716 17.25 24.1 17.25C24.9284 17.25 25.6 16.5784 25.6 15.75C25.6 14.9216 24.9284 14.25 24.1 14.25C23.2716 14.25 22.6 14.9216 22.6 15.75Z"
        stroke="currentColor"
      />
      <path
        d="M22.6 21.75C22.6 22.5784 23.2716 23.25 24.1 23.25C24.9284 23.25 25.6 22.5784 25.6 21.75C25.6 20.9216 24.9284 20.25 24.1 20.25C23.2716 20.25 22.6 20.9216 22.6 21.75Z"
        stroke="currentColor"
      />
    </svg>
  );
};
