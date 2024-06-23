import React from 'react';
import style from './dashboard.module.css';
import { Grid } from '../../common/grid/grid';

/**
 * Dashboard Page
 * @returns dashboard page element
 */
export function Dashboard() {
  return (
    <div>
      <h1 className={style.dashboardTitle}>
        Example dashboard page!!!
      </h1>

      <Grid rows={3} columns={3} />
    </div>
  )
}
