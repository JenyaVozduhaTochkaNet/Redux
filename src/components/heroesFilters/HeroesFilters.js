import {useSelector, useDispatch} from "react-redux"
import { filterClick, selectAll} from "../../slices/filtersSlice";
import store from '../../store/index'


const HeroesFilters = () => {
    const filters = selectAll(store.getState()),
          active = useSelector(state => state.filters),
          dispatch = useDispatch();
          

    const buttonsArr = filters.map((item, index) => {
        return <button key={index}
         onClick={() => dispatch(filterClick([item.name, item.className]))}
         className={`btn ${item.className} ${(item.className === active[1]) ? 'active' : ''}}`}>{item.label}</button>
    });

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                {buttonsArr}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;