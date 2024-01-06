import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Header from "../components/Header";
import Home from "../pages/Home";
import CardUser from "../components/CardUser";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Header">
                <Header/>
            </ComponentPreview>
            <ComponentPreview path="/Home">
                <Home/>
            </ComponentPreview>
            <ComponentPreview path="/CardUser">
                <CardUser/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews