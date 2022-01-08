import Link from "next/link";
const LinkText = ({ href, ...props }) => {
  return (
    <Link href={href || props.to}>
      <a style={{ textDecoration: "none" }}>{props.children}</a>
    </Link>
  );
};
export default LinkText;
