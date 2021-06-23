import './App.css'
import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {getCovidStatus} from "./Api";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function StatTable() {

    const classes = useStyles();
    const [covidStatus, setCovidStatus] = useState([]);

    useEffect(()=>{
        getCovidStatus()
            .then(_info => {
                setCovidStatus(_info)
            })
    },[])

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>지역</TableCell>
                        <TableCell align="right">현재 확진자 수</TableCell>
                        <TableCell align="right">현재 격리자 수</TableCell>
                        <TableCell align="right">누적 사망자 수</TableCell>
                        <TableCell align="right">누적 확진자 수</TableCell>
                        <TableCell align="right">기준일</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        covidStatus.map((e,idx) =>  {
                            if(idx<19) {
                                return(
                                    <TableRow key={e.gubun}>
                                        <TableCell component="th" scope="row">
                                            {e.gubun}
                                        </TableCell>
                                        <TableCell align="right">{e.localOccCnt}</TableCell>
                                        <TableCell align="right">{e.isolIngCnt}</TableCell>
                                        <TableCell align="right">{e.deathCnt}</TableCell>
                                        <TableCell align="right">{e.defCnt}</TableCell>
                                        <TableCell align="right">{e.stdDay}</TableCell>
                                    </TableRow>
                                )
                            } else {
                                return(<div></div>)
                            }
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}