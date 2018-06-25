import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { SERVICES } from '../../../constants/linksStructure'
import { fetchDentistForCategory, fetchServicesByCategory } from '../../../actions'
import style from './CategoryPage.css'
import { NarrowPage } from '../index'
import { Breadcrumbs } from '../../__containers__'
import { PricelistTable } from '../../__pricelist__'
import { PositionLabel } from '../../__basic__'
import { Dentist } from '../../Dentist'


const mapStateToProps = state => ({ ...state.categoryPage })

const mapDispatchToProps = { fetchDentistForCategory, fetchServicesByCategory }


let CategoryPage = class extends Component {
  static propTypes = {
    categoryId: PropTypes.string.isRequired,
    dentistsIds: PropTypes.array.isRequired,
    dentists: PropTypes.array,
    services: PropTypes.array,
    renderContent: PropTypes.func,
    renderAside: PropTypes.func
  }

  componentWillMount() {
    const { categoryId, dentistsIds, fetchDentistForCategory, fetchServicesByCategory } = this.props
    fetchServicesByCategory(categoryId)
    dentistsIds.forEach(id => fetchDentistForCategory(id))
  }

  renderDentist({ imageFolder, _id, name, positions }) {
    let fullSrca
    if (imageFolder) {
      fullSrc = require(`../../../assets/images/staff/${imageFolder}/full.png`)
    }

    return (
      <div
        key={_id}
        className={style.doctor}
      >
        <div
          className={style.photo}
          style={{ backgroundImage: `url(${fullSrc})` }}
        />
        <div className={style.about}>
          <div className={style.name}>
            {name}
          </div>
          <div className={style.positions}>
            {positions.join(', ')}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { title, dentists, services } = this.props

    if ((!dentists || dentists.length === 0) ||
        (!services || services.length === 0)) {
      return null
    }

    const dentistsClass = classNames({
      [style.dentistsOnly]: dentists.length === 1,
      [style.dentistsPair]: dentists.length === 2
    })

    return (
      <Breadcrumbs parentLink={SERVICES}>
        <NarrowPage squeeze={true} heading={title}>
          <div className={style.content}>
            {this.props.renderContent()}
          </div>
          <div className={dentistsClass}>
            {dentists.map((dentist, i) =>
              <div key={i} className={style.dentist}>
                <Dentist {...dentist} />
              </div>
            )}
          </div>
          <div className={style.pricelist}>
            <PricelistTable data={[{ title, services }]} />
          </div>
        </NarrowPage>
      </Breadcrumbs>
    )
  }
}


CategoryPage = connect(mapStateToProps, mapDispatchToProps)(CategoryPage)

export { CategoryPage }
