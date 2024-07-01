import React from 'react';
import style from './dashboard.module.css';
import { Grid } from '../../common/grid/grid';
import { NavBar } from '../../common/pages/navbar';

/**
 * Dashboard Page
 * @returns dashboard page element
 */
export function Dashboard() {
  return (
    <>
      <NavBar />
      <div>
        <h1 className={style.dashboardTitle}>
          Example dashboard page!!!
        </h1>

        <Grid rows={3} columns={3} />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
        <p>test</p><br />
      </div>
    </>
  )
}
