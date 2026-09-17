package school.sptech.projeto_individual_back;

public class Contratacao {

    private Integer id;
    private Integer alunoId;
    private Integer personalId;
    private String dataInicio;
    private String alunoNome;
    private String personalNome;

    public Contratacao() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(Integer alunoId) {
        this.alunoId = alunoId;
    }

    public Integer getPersonalId() {
        return personalId;
    }

    public void setPersonalId(Integer personalId) {
        this.personalId = personalId;
    }

    public String getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(String dataInicio) {
        this.dataInicio = dataInicio;
    }

    public String getAlunoNome() {
        return alunoNome;
    }

    public void setAlunoNome(String alunoNome) {
        this.alunoNome = alunoNome;
    }

    public String getPersonalNome() {
        return personalNome;
    }

    public void setPersonalNome(String personalNome) {
        this.personalNome = personalNome;
    }
}