import * as React from 'react';
import cx from 'classnames';
import { VISIBILITY_FILTERS } from './constants';
import { connect } from 'react-redux';
import { setFilter } from '../../store/actions';
import { StateType, DispatchType } from '../../types';

type VisibilityFiltersProps = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type VisibilityFiltersState = {};

const mapStateToProps = (state: StateType) => {
  return { activeFilter: state.visibilityFilter };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    setFilter: (filter: string) => dispatch(setFilter(filter))
  };
};

class VisibilityFilters extends React.Component<
  VisibilityFiltersProps,
  VisibilityFiltersState
> {
  constructor(props: VisibilityFiltersProps) {
    super(props);
    this.state = {};
  }
  render() {
    const activeFilter = this.props.activeFilter;
    return (
      <div>
        {Object.keys(VISIBILITY_FILTERS).map((filterKey: string) => {
          const currentFilter = VISIBILITY_FILTERS[filterKey];
          return (
            <span
              key={`visibility-filter-${currentFilter}`}
              className={cx(
                'filter',
                currentFilter === activeFilter && 'filter--active'
              )}
              onClick={() => this.props.setFilter(currentFilter)}
            >
              {currentFilter}
            </span>
          );
        })}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibilityFilters);
