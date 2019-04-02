import React, { Component } from 'react'

class MiniFrame extends Component {

    render() {
        let idName
        if(this.props.id === 'whiteArea')
            idName = 'whiteArea'
        else 
            idName = 'brownArea'

        return  (
            <div className='miniFrame' id={idName}>{this.props.children}</div>
        )
    }
}

export default MiniFrame