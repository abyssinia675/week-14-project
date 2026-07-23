const emptyForm = {
  name: "",
  description: "",
  categoryId: "",
};

export default function ItemForm({
  mode,
  form,
  categories,
  error,
  isSubmitting,
  isLoadingCategories,
  onChange,
  onSubmit,
  onCancel,
}) {
  const title = mode === "edit" ? "Edit application" : "Add an application";
  const buttonLabel = mode === "edit" ? "Save changes" : "Save application";
  const categoriesReady = categories.length > 0;
  const categoryPlaceholder = isLoadingCategories
    ? "Loading categories..."
    : "Select an application stage";

  return (
    <section className="panel" id="create-item">
      <h2>{title}</h2>
      <p className="panel-note">
        Track the role, company, and your latest notes for each application.
      </p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Role and company
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Backend Engineer - Stripe"
            minLength={2}
            required
          />
        </label>

        <label>
          Notes
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Applied via referral, recruiter call on Friday, salary target 90k"
            rows="4"
            minLength={5}
            required
          />
        </label>

        <label>
          Application stage
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            disabled={!categoriesReady}
            required
          >
            <option value="">{categoryPlaceholder}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {!isLoadingCategories && !categoriesReady ? (
          <p className="status status-error">
            Application stages are unavailable. Make sure the backend server is
            running.
          </p>
        ) : null}

        {error ? <p className="status status-error">{error}</p> : null}

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {buttonLabel}
          </button>
          {mode === "edit" ? (
            <button
              type="button"
              className="button-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export { emptyForm };
