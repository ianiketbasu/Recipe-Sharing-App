import Image from "next/image";
import Link from "next/link";

function RecipeCard({ props }) {
  return (
    <div className="me-3 mt-3">
      <div className="text-decoration-none">
        <div className="card" style={{ width: "18rem" }}>
          {console.log(props)}
          <Image
            width={250}
            height={250}
            src={props.imgUrl}
            className="card-img-top"
            alt="..."
          />
          <div
            className="card-body overflow-y-hidden"
            style={{ height: "150px" }}
          >
            <h5 className="card-title">{props.RecipeName}</h5>
            <p className="card-text">
              {props.Ingredients}
              {props.Instructions}
            </p>
          </div>
          <Link href={"/recipes/" + props.id} class="btn btn-primary">
            See Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
