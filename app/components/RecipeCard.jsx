import Image from "next/image";
import Link from "next/link";

function RecipeCard({ props }) {
  return (
    <div className="m-3 me-3 mt-3">
      <div className="text-decoration-none">
        <div className="card" style={{ width: "18rem" }}>
          {/* {console.log(props)} */}
          <Image
            width={200}
            height={250}
            src={props.imgUrl}
            className="card-img-top"
            alt="..."
          />
          <div
            className="card-body overflow-y-hidden "
            style={{ height: "150px" }}
          >
            <h5 className="card-title">{props.RecipeName}</h5>
            <p className="text-justify">
              {props.Instructions}
            </p>
          </div>
          <Link href={"/recipes/" + props.id} className="btn btn-primary m-2">
            See Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
