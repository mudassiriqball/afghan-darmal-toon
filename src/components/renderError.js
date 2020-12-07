import React from 'react'

import theme from '../constants/theme';

export default function renderError(error) {
    return (
        <div style={{ width: '100%' }}>
            <label style={{ color: theme.COLORS.ERROR, fontSize: theme.SIZES.ERROR }}>{error}</label>
        </div>
    )
}
