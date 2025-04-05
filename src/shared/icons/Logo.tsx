import type { Icon } from '@icons/index';

export const Logo = ({ ...props }: Icon) => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
      <path
        d="M20.0077 0C8.88769 0 0.00769043 8.96 0.00769043 20C0.00769043 31.04 8.96769 40 20.0077 40C31.0477 40 40.0077 31.04 40.0077 20C40.0077 8.96 31.0477 0 20.0077 0ZM20.0077 37.52C10.2477 37.52 2.40769 29.68 2.40769 19.92C2.40769 10.16 10.2477 2.32 20.0077 2.32C29.7677 2.32 37.6077 10.16 37.6077 19.92C37.5277 29.68 29.6877 37.52 20.0077 37.52Z"
        fill="currentColor"
      />
      <path
        d="M26.967 17.1661C26.3106 18.084 25.6608 19.104 25.0177 20.2261C24.3757 21.3481 23.7562 22.5194 23.1593 23.7399C22.5613 24.9594 22.0526 26.0943 21.6331 27.1445C21.0557 28.6009 20.6193 29.6538 20.3239 30.303C20.0285 30.9532 19.7336 31.4455 19.4393 31.7799C19.1439 32.1143 18.8188 32.2814 18.4639 32.2814C17.7952 32.2814 17.1721 31.9143 16.5947 31.1799C16.3721 30.9173 16.1029 30.6348 15.787 30.3322C15.4721 30.0307 15.2593 29.785 15.1485 29.5953C15.0367 29.4045 14.9808 29.1517 14.9808 28.8368C14.9808 28.522 15.0301 27.7871 15.1285 26.6322C15.227 25.4784 15.3218 24.1204 15.4131 22.5584C15.5054 20.9973 15.5777 18.944 15.6301 16.3984C15.1316 17.4476 14.6788 18.4645 14.2716 19.4491C13.8654 20.4204 13.4459 21.503 13.0131 22.6968C12.5793 23.8907 12.2577 24.7958 12.0485 25.4122C11.8126 26.0686 11.4911 27.2199 11.0839 28.8661C10.6767 30.5132 10.2767 31.7107 9.8839 32.4584C9.49005 33.2327 8.9321 33.6199 8.21005 33.6199C7.88185 33.6199 7.09467 33.1543 5.84851 32.223C4.83826 31.4876 4.33313 30.6281 4.33313 29.6445C4.33313 29.2507 4.55262 28.5158 4.99159 27.4399C5.43159 26.364 5.90749 25.2881 6.41928 24.2122C6.93108 23.1363 7.33774 22.2896 7.63928 21.6722C8.42698 20.0589 9.14236 18.6681 9.78544 17.4999C10.4275 16.3194 11.2147 15.0076 12.147 13.5645C13.0783 12.1081 14.187 10.4548 15.4731 8.60452V7.36452C15.4731 6.59016 15.5844 6.01939 15.807 5.65221C16.0306 5.28503 16.4967 5.10144 17.2054 5.10144C17.4413 5.10144 17.6706 5.14708 17.8931 5.23836C18.1167 5.33067 18.4644 5.42247 18.9362 5.51375C19.8285 5.65836 20.488 5.90452 20.9147 6.25221C21.3413 6.5999 21.5547 7.27888 21.5547 8.28913C21.5547 10.4676 21.2854 14.1614 20.747 19.3707C21.3111 18.2681 22.069 16.9527 23.0208 15.4245C23.9716 13.8953 25.0213 12.3568 26.1701 10.8091C27.3177 9.26042 28.4131 7.99067 29.4562 6.9999C30.4993 6.00913 31.3624 5.51375 32.0454 5.51375C32.3726 5.51375 32.648 5.59272 32.8716 5.75067C33.1075 5.90759 33.35 6.16349 33.5993 6.51836C33.8618 6.87221 34.0521 7.12811 34.1701 7.28606C34.4193 7.54759 34.6557 7.79683 34.8793 8.03375C35.1018 8.26965 35.2885 8.5317 35.4393 8.8199C35.5911 9.10913 35.667 9.43067 35.667 9.78452C35.667 10.1394 35.4767 10.7891 35.0962 11.7337C34.7157 12.6784 34.2136 13.9117 33.5901 15.4338C32.9665 16.9558 32.3598 18.6712 31.7701 20.5799C31.1793 22.4896 30.6675 24.5989 30.2347 26.9076C30.1424 27.3937 30.0142 28.4538 29.8501 30.0876C29.6859 31.7204 29.4726 32.9307 29.2101 33.7184C28.9485 34.505 28.509 34.8984 27.8916 34.8984C27.629 34.8984 27.3731 34.8394 27.1239 34.7214C26.8747 34.6035 26.586 34.4266 26.2577 34.1907C25.9306 33.9548 25.6947 33.7907 25.5501 33.6984C25.1695 33.4625 24.8383 33.2589 24.5562 33.0876C24.2742 32.9173 24.0475 32.6814 23.8762 32.3799C23.7059 32.0784 23.6208 31.6255 23.6208 31.0214C23.6208 30.1558 23.8342 28.8338 24.2608 27.0553C24.6875 25.2779 25.5895 21.9814 26.967 17.1661Z"
        fill="currentColor"
      />
    </svg>
  );
};
