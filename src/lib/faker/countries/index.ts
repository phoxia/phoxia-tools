import type { CountryData } from "../types";
import br from "./br";
import us from "./us";
import gb from "./gb";
import pt from "./pt";
import ar from "./ar";
import mx from "./mx";
import it from "./it";
import ca from "./ca";
import au from "./au";
import de from "./de";
import fr from "./fr";
import es from "./es";
import jp from "./jp";
import ind from "./in";

export const countries: Record<string, CountryData> = {
  br,
  us,
  gb,
  pt,
  ar,
  mx,
  it,
  ca,
  au,
  de,
  fr,
  es,
  jp,
  in: ind,
};

export const countryList: CountryData[] = Object.values(countries);

export function getCountry(id: string): CountryData {
  return countries[id] ?? countries["br"];
}
