package app.excpetions;

public class Unauthorized extends RuntimeException {
    public Unauthorized() {
        super("Unauthorized");
    }
}
