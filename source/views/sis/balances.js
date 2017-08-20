/**
 * @flow
 * All About Olaf
 * Balances page
 */

import React from 'react'
import {StyleSheet, ScrollView, View, Text, RefreshControl} from 'react-native'
import {TabBarIcon} from '../components/tabbar-icon'
import {connect} from 'react-redux'
import {Cell, TableView, Section} from 'react-native-tableview-simple'

import {updateBalances} from '../../flux/parts/sis'

import isNil from 'lodash/isNil'
import * as c from '../components/colors'

import type {TopLevelViewPropsType} from '../types'

class BalancesView extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Balances',
    tabBarIcon: TabBarIcon('card'),
  }

  props: TopLevelViewPropsType & {
    schillers: ?number,
    dining: ?number,
    print: ?number,
    weeklyMeals: ?number,
    dailyMeals: ?number,
    credentialsValid: boolean,
    message: ?string,
    loading: boolean,
    updateBalances: boolean => any,
  }

  fetchData = () => {
    return this.props.updateBalances(true)
  }

  openSettings = () => {
    this.props.navigation.navigate('SettingsView')
  }

  render() {
    const {
      schillers,
      dining,
      print,
      dailyMeals,
      weeklyMeals,
      loading,
    } = this.props

    return (
      <ScrollView
        contentContainerStyle={styles.stage}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={this.fetchData} />
        }
      >
        <TableView>
          <Section header="BALANCES">
            <View style={styles.balancesRow}>
              <FormattedValueCell
                label="Schillers"
                value={schillers}
                indeterminate={loading}
                formatter={getFormattedCurrency}
              />

              <FormattedValueCell
                label="Dining"
                value={dining}
                indeterminate={loading}
                formatter={getFormattedCurrency}
              />

              {/*<FormattedValueCell
                label="Copy/Print"
                value={print}
                indeterminate={loading}
                formatter={getFormattedCurrency}
                style={styles.finalCell}
              />*/}
            </View>
          </Section>

          <Section header="MEAL PLAN">
            <View style={styles.balancesRow}>
              <FormattedValueCell
                label="Daily Meals Left"
                value={dailyMeals}
                indeterminate={loading}
                formatter={getFormattedMealsRemaining}
              />

              <FormattedValueCell
                label="Weekly Meals Left"
                value={weeklyMeals}
                indeterminate={loading}
                formatter={getFormattedMealsRemaining}
                style={styles.finalCell}
              />
            </View>
          </Section>

          {!this.props.credentialsValid || this.props.message
            ? <Section footer="You'll need to log in again so we can update these numbers.">
                {!this.props.credentialsValid
                  ? <Cell
                      cellStyle="Basic"
                      title="Log in with Carleton"
                      accessory="DisclosureIndicator"
                      onPress={this.openSettings}
                    />
                  : null}

                {this.props.message
                  ? <Cell cellStyle="Basic" title={this.props.message} />
                  : null}
              </Section>
            : null}
        </TableView>
      </ScrollView>
    )
  }
}

function mapStateToProps(state) {
  return {
    schillers: state.sis.balances.schillers,
    dining: state.sis.balances.dining,
    print: state.sis.balances.print,
    weeklyMeals: state.sis.balances.weekly,
    dailyMeals: state.sis.balances.daily,
    message: state.sis.balances.message,
    loading: state.sis.balances.loading,

    credentialsValid: state.settings.credentials.valid,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateBalances: force => dispatch(updateBalances(force)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BalancesView)

let cellMargin = 10
let cellSidePadding = 10
let cellEdgePadding = 10

let styles = StyleSheet.create({
  stage: {
    backgroundColor: c.iosLightBackground,
    paddingTop: 20,
    paddingBottom: 20,
  },

  common: {
    backgroundColor: c.white,
  },

  balances: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: c.iosSeparator,
  },

  finalCell: {
    borderRightWidth: 0,
  },

  balancesRow: {
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: -10,
  },

  rectangle: {
    height: 88,
    flex: 1,
    alignItems: 'center',
    paddingTop: cellSidePadding,
    paddingBottom: cellSidePadding,
    paddingRight: cellEdgePadding,
    paddingLeft: cellEdgePadding,
    marginBottom: cellMargin,
  },

  // Text styling
  financialText: {
    paddingTop: 8,
    color: c.iosDisabledText,
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 23,
  },
  rectangleButtonText: {
    paddingTop: 15,
    color: c.black,
    textAlign: 'center',
    fontSize: 16,
  },
})

function getFormattedCurrency(value: ?number): string {
  if (isNil(value)) {
    return 'N/A'
  }
  return '$' + (((value: any): number) / 100).toFixed(2)
}

function getFormattedMealsRemaining(value: ?number): string {
  if (isNil(value)) {
    return 'N/A'
  }
  return (value: any).toString()
}

function FormattedValueCell({
  indeterminate,
  label,
  value,
  style,
  formatter,
}: {
  indeterminate: boolean,
  label: string,
  value: ?number,
  style?: any,
  formatter: (?number) => string,
}) {
  return (
    <View style={[styles.rectangle, styles.common, styles.balances, style]}>
      <Text
        selectable={true}
        style={styles.financialText}
        autoAdjustsFontSize={true}
      >
        {indeterminate ? '…' : formatter(value)}
      </Text>
      <Text style={styles.rectangleButtonText} autoAdjustsFontSize={true}>
        {label}
      </Text>
    </View>
  )
}
