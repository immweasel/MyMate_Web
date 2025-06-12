import { useEffect } from 'react';

const ReturnSup = ({ Obr, formLink }) => {
    useEffect(() => { window.location.href = formLink; }, [formLink]);

    return null;
};

export default ReturnSup;
