import React, { useCallback } from "react";
import styles from "./styles.module.css";
import { useRouteMatch, useHistory } from "react-router-dom";

type PropsType = {
  label: string;
  to: string;
};

function MenuLink({ label, to }: PropsType) {
  const match = useRouteMatch({
    path: to,
    exact: true,
  });
  const history = useHistory();

  const handleClick = useCallback(() => {
    history.push(to);
  }, [history, to]);

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
