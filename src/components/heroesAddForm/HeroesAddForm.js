import { nanoid } from "@reduxjs/toolkit"
import { heroAdd } from "../../slices/heroesSlice";
import { filtersFetch, selectAll} from "../../slices/filtersSlice";
import { useState, useEffect } from 'react';
import { useDispatch,useSelector} from "react-redux";
import {useHttp} from '../../hooks/http.hook';
import store from "../../store/index"

const HeroesAddForm = () => {
    const [name, setHeroName] = useState(''),
          [description, setDesctiption] = useState(undefined),
          [element, setHeroElement] = useState(undefined),
          filters = selectAll(store.getState()),
          filterLoadingStatus = useSelector(state => state.filters),
          dispatch = useDispatch(),
          {request} = useHttp(),
           id = nanoid();

    useEffect(() => {
        dispatch(filtersFetch());
    }, []);

    const onAddHero = (id, name, description, element) => {
         request('http://localhost:3001/heroes', 'POST', JSON.stringify({id, name, description, element}))
        .then(() => console.log(`Hero ${name} was added`))
        .catch(() => console.log(`Adding error`));

        setHeroName('');
        setDesctiption('');
        setHeroElement('');
        return {id, name, description, element};
    };
    
    const options = (filters, loadingStatus) => {
        if (loadingStatus === 'loading'){
            return <option>Загрузка элементов</option>
        } else if(loadingStatus === 'error') {
            <option>Ошибка загузки</option>
        } else {
            return filters.map((item, id) => {
                if(item.name !== 'all'){
                return <option key={id} value={item.name}>{item.label}</option>
                }
            })
        }
    };

    return (
        <form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    value={name}
                    onChange={(e) => setHeroName(e.target.value)}
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    value={description}
                    onChange={(e) =>setDesctiption(e.target.value)}
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    value={element}
                    onChange={(e) => setHeroElement(e.target.value)}
                    required
                    className="form-select" 
                    id="element" 
                    name="element">
                    <option >Я владею элементом...</option>
                    {options(filters, filterLoadingStatus)}
                </select>
            </div>

            <button type="submit" 
                    className="btn btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(heroAdd(onAddHero(id, name, description, element)))}}>Создать</button>
        </form>
    )
}

export default HeroesAddForm;