
USE master ;  
GO  

/*�������� ���� ������, ���� �����*/
DROP DATABASE ParentAndChilds;  
GO  

/*�������� ���� ������*/
Create database ParentAndChilds
go

/*�������� �������� � ��������� ��*/
use ParentAndChilds
go

/*������� �������, ���� ����� ��� ����������*/
IF OBJECT_ID('ParentsAndSubsidiary') IS NOT NULL
        DROP TABLE dbo.ParentsAndSubsidiary

/*�������� �������*/
CREATE TABLE ParentsAndSubsidiary
    (
		companyID        INT	primary	key  NOT NULL identity(1,1),
		parentID         INT                 NOT NULL,
		companyName      VARCHAR(50)         NOT NULL,
		companyEarning   INT                 NOT NULL
    )

/*��������� ����� ���� ������������ ��� ������� ������ ��� ������������ ������ ����������*/

/*������ �������� �������� �� �������� -1 � ������� parentID. ��� ������, ��� ������ ������ �������� ��������, 
����� ������� � ��������. ��� ���������� ����������� ������� ���������� ����� ������������ -1*/

INSERT INTO ParentsAndSubsidiary
        (parentID, companyName, companyEarning)
 SELECT  -1,'Google'    ,200000 UNION ALL
 SELECT   1,'Apple'  , 90000 UNION ALL
 SELECT   1,'Microsoft'    ,100000 UNION ALL
 SELECT   2,'Coca-Cola'   , 75000 UNION ALL
 SELECT   2,'Daimler'   , 80000 UNION ALL
 SELECT   3,'Audi' , 60000 UNION ALL
 SELECT   4,'BMW'  , 50000 UNION ALL
 SELECT   4,'Adidas'    , 55000 UNION ALL
 SELECT   5,'Siemens'  , 70000 UNION ALL
 SELECT   7,'Nike'   , 40000 UNION ALL
 SELECT   6,'Rieker', 40000 UNION ALL
 SELECT   8,'Dell'  , 30000 UNION ALL
 SELECT   7,'Philips'    , 90000 UNION ALL
 SELECT   6,'MotorSich'  ,120000  
;

/*��������, ��� � ������� ��������� ������*/
Select * from ParentsAndSubsidiary
/*-----------------------------------------------*/

/*��������� ������, ����� �������� ������ �������� ���������*/
 CREATE INDEX IX_ParentsAndSubsidiary_Composite
     ON dbo.ParentsAndSubsidiary (parentID, companyID, companyName)
;

/*������� �������� ��������� ��� ���������� ������*/
GO
CREATE PROC ParentSubs
AS
BEGIN
with C as
(
  select p.companyID,
         p.companyEarning,
         p.companyID as RootID
  from ParentsAndSubsidiary p
  union all
  select p.companyID,
         p.companyEarning,	
         C.RootID
  from dbo.ParentsAndSubsidiary p
    inner join C 
      on p.parentID = C.companyID             
)
select p.companyID,
       p.parentID,
       p.companyName,
       p.companyEarning,
       S.totalCompanyEarnings
from ParentsAndSubsidiary p
  inner join (
             select RootID,
                    sum(companyEarning) as totalCompanyEarnings
             from C
             group by RootID
             ) as S
    on p.companyID = S.RootID
order by p.companyID
option (maxrecursion 0);
END


/*������ �������� ���������*/
EXEC ParentSubs
go

/*�������� �������� ���������, ���� �����*/
drop procedure ParentSubs;
drop procedure DeleteAnyNode;
drop procedure Element;

/*�������� �������� ��������� ��� �������� ����� ������� ������*/
GO
CREATE PROC DeleteAnyNode
    (
        @id int
    )
AS
BEGIN
  with dell as (
  select companyID, parentID
  from ParentsAndSubsidiary
  where companyID = @id
  union all
  select p.companyID, p.parentID
  from ParentsAndSubsidiary p
    join dell d on d.companyID = p.parentID
)
delete from ParentsAndSubsidiary
where companyID in (select companyID from dell);
END


/*������ ���������� �������� ���������*/
EXEC DeleteAnyNode @id = 3
go


/*�������� �������� ��������� ��� ����, ����� ���������� ����� �������, ������� ��������� � ������*/
GO
CREATE PROC Element
    (
        @id int
    )
AS
BEGIN
with C as
(
  select p.companyID,
         p.companyEarning,
         p.companyID as RootID
  from ParentsAndSubsidiary p
  union all
  select p.companyID,
         p.companyEarning,	
         C.RootID
  from dbo.ParentsAndSubsidiary p
    inner join C 
      on p.parentID = C.companyID             
)
select p.companyID,
       p.parentID,
       p.companyName,
       p.companyEarning,
       S.totalCompanyEarnings
from ParentsAndSubsidiary p 
  inner join (
             select RootID,
                    sum(companyEarning) as totalCompanyEarnings
             from C
             group by RootID
             ) as S
    on p.companyID = S.RootID
	where p.companyID = @id
order by p.companyID
option (maxrecursion 0);
END

/*���������� �������� ���������*/
Exec Element @id=8

/*�������� ���������, ���� �����*/
drop procedure Element;
