import React, { useCallback } from "react";
import styles from "./styles.module.css";
import { Link, useRouteMatch, useHistory } from "react-router-dom";

type PropsType = {
  label: string;
  to: string;
};

function MenuLink({ label, to }: PropsType) {
  const match = useRouteMatch({
    path: to,
  });
  const history = useHistory();

  const handleClick = useCallback(() => {
    history.push(to);
  }, [history]);

  return (
    <div
      className={match ? styles.appNavItemActive : styles.appNavItem}
      onClick={handleClick}
    >
      {label}
    </div>
  );
}

export default MenuLink;
